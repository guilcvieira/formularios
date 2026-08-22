export type FormStatus = 'draft' | 'published'

export interface Form {
  id: number
  userId: string
  name: string
  description: string
  content: FormElementInstance[]
  published: boolean
  visits: number
  submissions: number
  shareUrl: string
  createdAt: Date
  updatedAt: Date
}

export interface FormElementInstance {
  id: string
  type: string
  extraAttributes?: Record<string, unknown>
}

export interface FormSubmission {
  id: number
  formId: number
  content: Record<string, string>
  timeToComplete: number | null
  device: string
  createdAt: Date
}

export interface FormEvent {
  id: number
  formId: number
  sessionId: string
  type: 'form_start' | 'field_interaction' | 'field_error' | 'form_abandon'
  fieldId: string | null
  metadata: Record<string, unknown> | null
  createdAt: Date
}

export interface FormStats {
  visits: number
  submissions: number
  submissionRate: number
  bounceRate: number
}
