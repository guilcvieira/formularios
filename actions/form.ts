'use server'

import { currentUser } from '@clerk/nextjs/server'
import { prismaFormRepository } from '@/infra/prisma/form-repository'
import {
  createForm,
  getForms,
  getFormById,
  getFormStats,
  updateFormContent,
  publishForm,
  getFormContentByUrl,
  submitForm,
} from '@/use-cases'
import { dispatchFlowEvent } from '@/infra/events/flow-events-client'

const repo = prismaFormRepository

export async function GetFormStats() {
  const user = await currentUser()
  if (!user) throw new Error('User not found')

  const result = await getFormStats(repo, { userId: user.id })

  if (!result.success) throw new Error(result.error)

  const { visits, submissions, submissionRate, bounceRate } = result.data

  return {
    visits,
    submissions,
    submissionRate: submissionRate.toFixed(2),
    bounceRate: bounceRate.toFixed(2),
  }
}

export async function CreateForm(data: { name: string; description?: string }) {
  const user = await currentUser()
  if (!user) throw new Error('User not found')

  const result = await createForm(repo, {
    userId: user.id,
    name: data.name,
    description: data.description ?? '',
  })

  if (!result.success) throw new Error(result.error)
  return result.data.id
}

export async function GetForms() {
  const user = await currentUser()
  if (!user) throw new Error('User not found')

  const result = await getForms(repo, { userId: user.id })

  if (!result.success) throw new Error(result.error)

  return result.data.map((form) => ({
    ...form,
    content: JSON.stringify(form.content),
  }))
}

export async function GetFormById(id: number) {
  const user = await currentUser()
  if (!user) throw new Error('User not found')

  const result = await getFormById(repo, { formId: id, userId: user.id })

  if (!result.success) return null

  return {
    ...result.data,
    content: JSON.stringify(result.data.content),
  }
}

export async function GetFormContentByURL(formUrl: string) {
  const result = await getFormContentByUrl(repo, { formUrl })

  if (!result.success) throw new Error(result.error)

  return {
    id: result.data.id,
    content: JSON.stringify(result.data.content),
  }
}

export async function UpdateFormContent(id: number, jsonContent: string) {
  const user = await currentUser()
  if (!user) throw new Error('User not found')

  const content = JSON.parse(jsonContent)

  const result = await updateFormContent(repo, {
    formId: id,
    userId: user.id,
    content,
  })

  if (!result.success) throw new Error(result.error)
}

export async function PublishForm(id: number) {
  const user = await currentUser()
  if (!user) throw new Error('User not found')

  const result = await publishForm(repo, { formId: id, userId: user.id })

  if (!result.success) throw new Error(result.error)

  const form = await repo.findById(id)
  if (form) {
    void dispatchFlowEvent('form.published', {
      formId: form.id,
      formName: form.name,
      shareUrl: form.shareUrl,
    })
  }
}

export async function SubmitFunction(
  formUrl: string,
  content: string,
  timeToComplete?: number,
  device?: string,
) {
  const parsedContent = JSON.parse(content) as Record<string, string>

  const result = await submitForm(repo, {
    formUrl,
    content: parsedContent,
    timeToComplete,
    device,
  })

  if (!result.success) throw new Error(result.error)

  const form = await repo.findByShareUrl(formUrl)

  void dispatchFlowEvent('form.submitted', {
    formId: result.data.formId,
    formName: form?.name ?? '',
    submissionId: result.data.id,
    content: parsedContent,
  })
}

export async function GetFormWithSubissions(formId: number) {
  const user = await currentUser()
  if (!user) throw new Error('User not found')

  const data = await repo.getFormWithSubmissions(formId)

  if (!data) return null

  if (data.userId !== user.id) throw new Error('Form not found')

  return {
    ...data,
    content: JSON.stringify(data.content),
    FormSubmission: data.formSubmissions.map((sub) => ({
      ...sub,
      content: JSON.stringify(sub.content),
    })),
  }
}
