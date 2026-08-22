import prisma from '@/lib/prisma'
import { formContentSchema, submissionContentSchema } from '@/domain/schemas/form-content'
import type { Form, FormSubmission, FormEvent, FormStats, FormElementInstance } from '@/domain/entities'
import type { FormRepository, CreateFormInput } from '@/repositories/form-repository'

function mapFormToDomain(raw: {
  id: number
  userId: string
  name: string
  description: string
  content: string
  published: boolean
  visits: number
  submissions: number
  shareUrl: string
  createdAt: Date
  updatedAt: Date
}): Form {
  const parsedContent = formContentSchema.safeParse(JSON.parse(raw.content))
  return {
    id: raw.id,
    userId: raw.userId,
    name: raw.name,
    description: raw.description,
    content: parsedContent.success ? parsedContent.data : [],
    published: raw.published,
    visits: raw.visits,
    submissions: raw.submissions,
    shareUrl: raw.shareUrl,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

function mapSubmissionToDomain(raw: {
  id: number
  formId: number
  content: string
  timeToComplete: number | null
  device: string
  createdAt: Date
}): FormSubmission {
  const parsedContent = submissionContentSchema.safeParse(JSON.parse(raw.content))
  return {
    id: raw.id,
    formId: raw.formId,
    content: parsedContent.success ? parsedContent.data : {},
    timeToComplete: raw.timeToComplete,
    device: raw.device,
    createdAt: raw.createdAt,
  }
}

function mapEventToDomain(raw: {
  id: number
  formId: number
  sessionId: string
  type: string
  fieldId: string | null
  metadata: string | null
  createdAt: Date
}): FormEvent {
  let parsedMetadata: Record<string, unknown> | null = null
  if (raw.metadata) {
    try {
      parsedMetadata = JSON.parse(raw.metadata)
    } catch {
      parsedMetadata = null
    }
  }
  return {
    id: raw.id,
    formId: raw.formId,
    sessionId: raw.sessionId,
    type: raw.type as FormEvent['type'],
    fieldId: raw.fieldId,
    metadata: parsedMetadata,
    createdAt: raw.createdAt,
  }
}

export const prismaFormRepository: FormRepository = {
  async create(input: CreateFormInput): Promise<Form> {
    const form = await prisma.form.create({
      data: {
        userId: input.userId,
        name: input.name,
        description: input.description,
      },
    })
    return mapFormToDomain(form)
  },

  async findById(id: number): Promise<Form | null> {
    const form = await prisma.form.findUnique({ where: { id } })
    return form ? mapFormToDomain(form) : null
  },

  async findByUserId(userId: string): Promise<Form[]> {
    const forms = await prisma.form.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
    return forms.map(mapFormToDomain)
  },

  async findByShareUrl(shareUrl: string): Promise<Form | null> {
    const form = await prisma.form.findFirst({ where: { shareUrl } })
    return form ? mapFormToDomain(form) : null
  },

  async updateContent(id: number, content: FormElementInstance[]): Promise<void> {
    await prisma.form.update({
      where: { id },
      data: { content: JSON.stringify(content) },
    })
  },

  async publish(id: number): Promise<void> {
    await prisma.form.update({
      where: { id },
      data: { published: true },
    })
  },

  async incrementVisits(id: number): Promise<void> {
    await prisma.form.update({
      where: { id },
      data: { visits: { increment: 1 } },
    })
  },

  async getStats(userId: string): Promise<FormStats> {
    const stats = await prisma.form.aggregate({
      where: { userId },
      _sum: {
        visits: true,
        submissions: true,
      },
    })

    const visits = stats._sum.visits || 0
    const submissions = stats._sum.submissions || 0

    let submissionRate = 0
    if (visits > 0) {
      submissionRate = (submissions / visits) * 100
    }

    const bounceRate = 100 - submissionRate

    return {
      visits,
      submissions,
      submissionRate,
      bounceRate,
    }
  },

  async getFormWithSubmissions(id: number): Promise<(Form & { formSubmissions: FormSubmission[] }) | null> {
    const form = await prisma.form.findUnique({
      where: { id },
      include: { FormSubmission: true },
    })

    if (!form) return null

    return {
      ...mapFormToDomain(form),
      formSubmissions: form.FormSubmission.map((sub) => mapSubmissionToDomain({
        id: sub.id,
        formId: sub.formId,
        content: sub.content,
        timeToComplete: sub.timeToComplete,
        device: sub.device,
        createdAt: sub.createdAt,
      })),
    }
  },

  async createSubmission(
    formId: number,
    content: Record<string, string>,
    timeToComplete: number | null,
    device: string,
  ): Promise<FormSubmission> {
    const submission = await prisma.formSubmission.create({
      data: {
        formId,
        content: JSON.stringify(content),
        timeToComplete,
        device,
      },
    })
    return mapSubmissionToDomain({
      id: submission.id,
      formId: submission.formId,
      content: submission.content,
      timeToComplete: submission.timeToComplete,
      device: submission.device,
      createdAt: submission.createdAt,
    })
  },

  async incrementSubmissions(id: number): Promise<void> {
    await prisma.form.update({
      where: { id },
      data: { submissions: { increment: 1 } },
    })
  },

  async createEvent(
    formId: number,
    sessionId: string,
    type: string,
    fieldId: string | null,
    metadata: Record<string, unknown> | null,
  ): Promise<void> {
    await prisma.formEvent.create({
      data: {
        formId,
        sessionId,
        type,
        fieldId,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    })
  },

  async getAnalytics(formId: number): Promise<{
    submissions: FormSubmission[]
    events: FormEvent[]
    totalVisits: number
    totalSubmissions: number
  }> {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      select: { visits: true, submissions: true },
    })

    if (!form) {
      return { submissions: [], events: [], totalVisits: 0, totalSubmissions: 0 }
    }

    const [rawSubmissions, rawEvents] = await Promise.all([
      prisma.formSubmission.findMany({ where: { formId } }),
      prisma.formEvent.findMany({ where: { formId } }),
    ])

    return {
      submissions: rawSubmissions.map((sub) => mapSubmissionToDomain({
        id: sub.id,
        formId: sub.formId,
        content: sub.content,
        timeToComplete: sub.timeToComplete,
        device: sub.device,
        createdAt: sub.createdAt,
      })),
      events: rawEvents.map((evt) => mapEventToDomain({
        id: evt.id,
        formId: evt.formId,
        sessionId: evt.sessionId,
        type: evt.type,
        fieldId: evt.fieldId,
        metadata: evt.metadata,
        createdAt: evt.createdAt,
      })),
      totalVisits: form.visits,
      totalSubmissions: form.submissions,
    }
  },
}
