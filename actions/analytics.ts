'use server'

import { currentUser } from '@clerk/nextjs/server'
import { prismaFormRepository } from '@/infra/prisma/form-repository'
import { trackFormEvent, getFormAnalytics } from '@/use-cases'
import type { FormSubmission, FormEvent } from '@/domain/entities'

const repo = prismaFormRepository

export async function TrackFormEvent(
  formUrl: string,
  sessionId: string,
  type: 'form_start' | 'field_interaction' | 'field_error' | 'form_abandon',
  fieldId?: string,
  metadata?: string,
) {
  const parsedMetadata = metadata ? JSON.parse(metadata) : undefined

  await trackFormEvent(repo, {
    formUrl,
    sessionId,
    type,
    fieldId,
    metadata: parsedMetadata,
  })
}

export async function GetFormAnalytics(formId: number) {
  const user = await currentUser()
  if (!user) throw new Error('User not authenticated')

  const result = await getFormAnalytics(repo, { formId, userId: user.id })

  if (!result.success) throw new Error(result.error)

  const { submissions, events, totalVisits, totalSubmissions } = result.data

  const [avgTime, deviceBreakdown, fieldDropOff, fieldErrors, submissionTimeline] =
    await Promise.all([
      computeAvgTimeToComplete(submissions),
      computeDeviceBreakdown(submissions),
      computeFieldDropOff(events),
      computeFieldErrorRates(events, totalSubmissions),
      computeSubmissionTimeline(submissions, events),
    ])

  return {
    avgTimeToComplete: avgTime,
    deviceBreakdown,
    fieldDropOff,
    fieldErrors,
    submissionTimeline,
  }
}

function computeAvgTimeToComplete(submissions: FormSubmission[]) {
  const withTime = submissions.filter((s) => s.timeToComplete !== null)
  const totalTime = withTime.reduce((sum, s) => sum + (s.timeToComplete ?? 0), 0)

  return {
    avgSeconds: withTime.length > 0 ? Math.round(totalTime / withTime.length) : 0,
    sampleSize: withTime.length,
  }
}

function computeDeviceBreakdown(submissions: FormSubmission[]) {
  const deviceMap = new Map<string, number>()

  for (const sub of submissions) {
    const count = deviceMap.get(sub.device) ?? 0
    deviceMap.set(sub.device, count + 1)
  }

  const total = submissions.length

  return Array.from(deviceMap.entries()).map(([device, count]) => ({
    device,
    count,
    percentage: total > 0 ? Math.round((count / total) * 100) : 0,
  }))
}

function computeFieldDropOff(events: FormEvent[]) {
  const startSessions = new Set(
    events.filter((e) => e.type === 'form_start').map((e) => e.sessionId),
  )

  const totalStartCount = startSessions.size
  if (totalStartCount === 0) return []

  const fieldSessions = new Map<string, Set<string>>()

  for (const event of events) {
    if (event.type === 'field_interaction' && event.fieldId) {
      if (!fieldSessions.has(event.fieldId)) {
        fieldSessions.set(event.fieldId, new Set())
      }
      fieldSessions.get(event.fieldId)!.add(event.sessionId)
    }
  }

  return Array.from(fieldSessions.entries()).map(([fieldId, sessions]) => ({
    fieldId,
    interacted: sessions.size,
    totalStarts: totalStartCount,
    dropOffRate: Math.round(((totalStartCount - sessions.size) / totalStartCount) * 100),
  }))
}

function computeFieldErrorRates(events: FormEvent[], totalSubmissions: number) {
  const errorCounts = new Map<string, number>()

  for (const event of events) {
    if (event.type === 'field_error' && event.fieldId) {
      const count = errorCounts.get(event.fieldId) ?? 0
      errorCounts.set(event.fieldId, count + 1)
    }
  }

  return Array.from(errorCounts.entries()).map(([fieldId, errorCount]) => ({
    fieldId,
    errorCount,
    errorRate: totalSubmissions > 0 ? Math.round((errorCount / totalSubmissions) * 100) : 0,
  }))
}

function computeSubmissionTimeline(submissions: FormSubmission[], events: FormEvent[]) {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const dailyMap = new Map<string, { submissions: number; visits: number }>()

  for (let i = 0; i < 30; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    const key = date.toISOString().split('T')[0]
    dailyMap.set(key, { submissions: 0, visits: 0 })
  }

  for (const sub of submissions) {
    if (sub.createdAt >= thirtyDaysAgo) {
      const key = sub.createdAt.toISOString().split('T')[0]
      const entry = dailyMap.get(key)
      if (entry) entry.submissions++
    }
  }

  for (const event of events) {
    if (event.type === 'form_start' && event.createdAt >= thirtyDaysAgo) {
      const key = event.createdAt.toISOString().split('T')[0]
      const entry = dailyMap.get(key)
      if (entry) entry.visits++
    }
  }

  return Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    submissions: data.submissions,
    visits: data.visits,
  }))
}
