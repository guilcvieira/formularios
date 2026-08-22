import type { Form, FormSubmission, FormEvent, FormStats, FormElementInstance } from '@/domain/entities'

export interface CreateFormInput {
  userId: string
  name: string
  description: string
}

export interface FormRepository {
  create(input: CreateFormInput): Promise<Form>
  findById(id: number): Promise<Form | null>
  findByUserId(userId: string): Promise<Form[]>
  findByShareUrl(shareUrl: string): Promise<Form | null>
  updateContent(id: number, content: FormElementInstance[]): Promise<void>
  publish(id: number): Promise<void>
  incrementVisits(id: number): Promise<void>
  getStats(userId: string): Promise<FormStats>
  getFormWithSubmissions(id: number): Promise<(Form & { formSubmissions: FormSubmission[] }) | null>
  createSubmission(formId: number, content: Record<string, string>, timeToComplete: number | null, device: string): Promise<FormSubmission>
  incrementSubmissions(id: number): Promise<void>
  createEvent(formId: number, sessionId: string, type: string, fieldId: string | null, metadata: Record<string, unknown> | null): Promise<void>
  getAnalytics(formId: number): Promise<{
    submissions: FormSubmission[]
    events: FormEvent[]
    totalVisits: number
    totalSubmissions: number
  }>
}
