import type { FormRepository } from '@/repositories/form-repository'
import type { FormSubmission, FormEvent } from '@/domain/entities'

interface GetFormAnalyticsInput {
  formId: number
  userId: string
}

interface FormAnalyticsData {
  submissions: FormSubmission[]
  events: FormEvent[]
  totalVisits: number
  totalSubmissions: number
}

type GetFormAnalyticsResult =
  | { success: true; data: FormAnalyticsData }
  | { success: false; error: string }

export async function getFormAnalytics(
  repository: FormRepository,
  input: GetFormAnalyticsInput,
): Promise<GetFormAnalyticsResult> {
  if (!input.userId) {
    return { success: false, error: 'User ID is required' }
  }

  const form = await repository.findById(input.formId)

  if (!form) {
    return { success: false, error: 'Form not found' }
  }

  if (form.userId !== input.userId) {
    return { success: false, error: 'Form not found' }
  }

  const analytics = await repository.getAnalytics(input.formId)
  return { success: true, data: analytics }
}
