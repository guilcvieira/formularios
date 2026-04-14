'use server';

import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server';

export async function TrackFormEvent(
  formUrl: string,
  sessionId: string,
  type: 'form_start' | 'field_interaction' | 'field_error' | 'form_abandon',
  fieldId?: string,
  metadata?: string,
) {
  const form = await prisma.form.findFirst({
    where: { shareUrl: formUrl, published: true },
    select: { id: true },
  });

  if (!form) return;

  await prisma.formEvent.create({
    data: {
      formId: form.id,
      sessionId,
      type,
      fieldId: fieldId ?? null,
      metadata: metadata ?? null,
    },
  });
}

export async function GetFormAnalytics(formId: number) {
  const user = await currentUser();
  if (!user) throw new Error('User not authenticated');

  const form = await prisma.form.findUnique({
    where: { id: formId, userId: user.id },
    select: { id: true, visits: true, submissions: true },
  });

  if (!form) throw new Error('Form not found');

  const [
    avgTime,
    deviceBreakdown,
    fieldDropOff,
    fieldErrors,
    submissionTimeline,
  ] = await Promise.all([
    getAvgTimeToComplete(formId),
    getDeviceBreakdown(formId),
    getFieldDropOff(formId),
    getFieldErrorRates(formId),
    getSubmissionTimeline(formId),
  ]);

  return {
    avgTimeToComplete: avgTime,
    deviceBreakdown,
    fieldDropOff,
    fieldErrors,
    submissionTimeline,
  };
}

// Avg time to complete (in seconds)
async function getAvgTimeToComplete(formId: number) {
  const result = await prisma.formSubmission.aggregate({
    where: {
      formId,
      timeToComplete: { not: null },
    },
    _avg: { timeToComplete: true },
    _count: { timeToComplete: true },
  });

  return {
    avgSeconds: Math.round(result._avg.timeToComplete ?? 0),
    sampleSize: result._count.timeToComplete,
  };
}

// Device breakdown from submissions
async function getDeviceBreakdown(formId: number) {
  const submissions = await prisma.formSubmission.groupBy({
    by: ['device'],
    where: { formId },
    _count: { id: true },
  });

  const total = submissions.reduce((sum, s) => sum + s._count.id, 0);

  return submissions.map((s) => ({
    device: s.device,
    count: s._count.id,
    percentage: total > 0 ? Math.round((s._count.id / total) * 100) : 0,
  }));
}

// Field drop-off: count unique sessions that interacted with each field
// vs sessions that started the form
async function getFieldDropOff(formId: number) {
  const totalStarts = await prisma.formEvent.groupBy({
    by: ['sessionId'],
    where: { formId, type: 'form_start' },
  });

  const totalStartCount = totalStarts.length;

  if (totalStartCount === 0) return [];

  const fieldInteractions = await prisma.formEvent.groupBy({
    by: ['fieldId'],
    where: {
      formId,
      type: 'field_interaction',
      fieldId: { not: null },
    },
    _count: { _all: true },
  });

  // Count unique sessions per field
  const fieldSessionCounts: { fieldId: string; sessions: number }[] = [];

  for (const field of fieldInteractions) {
    if (!field.fieldId) continue;

    const uniqueSessions = await prisma.formEvent.groupBy({
      by: ['sessionId'],
      where: {
        formId,
        type: 'field_interaction',
        fieldId: field.fieldId,
      },
    });

    fieldSessionCounts.push({
      fieldId: field.fieldId,
      sessions: uniqueSessions.length,
    });
  }

  return fieldSessionCounts.map((f) => ({
    fieldId: f.fieldId,
    interacted: f.sessions,
    totalStarts: totalStartCount,
    dropOffRate: Math.round(
      ((totalStartCount - f.sessions) / totalStartCount) * 100,
    ),
  }));
}

// Field error rates
async function getFieldErrorRates(formId: number) {
  const errors = await prisma.formEvent.groupBy({
    by: ['fieldId'],
    where: {
      formId,
      type: 'field_error',
      fieldId: { not: null },
    },
    _count: { _all: true },
  });

  const totalSubmissions = await prisma.formSubmission.count({
    where: { formId },
  });

  return errors
    .filter((e) => e.fieldId !== null)
    .map((e) => ({
      fieldId: e.fieldId!,
      errorCount: e._count._all,
      errorRate:
        totalSubmissions > 0
          ? Math.round((e._count._all / totalSubmissions) * 100)
          : 0,
    }));
}

// Submission timeline (grouped by day for the last 30 days)
async function getSubmissionTimeline(formId: number) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const submissions = await prisma.formSubmission.findMany({
    where: {
      formId,
      createdAt: { gte: thirtyDaysAgo },
    },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  const visits = await prisma.formEvent.findMany({
    where: {
      formId,
      type: 'form_start',
      createdAt: { gte: thirtyDaysAgo },
    },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  });

  // Group by date
  const dailyMap = new Map<string, { submissions: number; visits: number }>();

  // Initialize all 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    const key = date.toISOString().split('T')[0];
    dailyMap.set(key, { submissions: 0, visits: 0 });
  }

  submissions.forEach((s) => {
    const key = s.createdAt.toISOString().split('T')[0];
    const entry = dailyMap.get(key);
    if (entry) entry.submissions++;
  });

  visits.forEach((v) => {
    const key = v.createdAt.toISOString().split('T')[0];
    const entry = dailyMap.get(key);
    if (entry) entry.visits++;
  });

  return Array.from(dailyMap.entries()).map(([date, data]) => ({
    date,
    submissions: data.submissions,
    visits: data.visits,
  }));
}
