import type { FormRepository } from '@/repositories/form-repository'
import type { FormSubmission } from '@/domain/entities'
import { submissionContentSchema } from '@/domain/schemas/form-content'

interface SubmitFormInput {
  formUrl: string
  content: Record<string, string>
  timeToComplete?: number
  device?: string
}

type SubmitFormResult =
  | { success: true; data: FormSubmission }
  | { success: false; error: string }

export async function submitForm(
  repository: FormRepository,
  input: SubmitFormInput,
): Promise<SubmitFormResult> {
  if (!input.formUrl) {
    return { success: false, error: 'Form URL is required' }
  }

  const validation = submissionContentSchema.safeParse(input.content)
  if (!validation.success) {
    return { success: false, error: 'Invalid submission content' }
  }

  const form = await repository.findByShareUrl(input.formUrl)

  if (!form || !form.published) {
    return { success: false, error: 'Form not found or not published' }
  }

  const submission = await repository.createSubmission(
    form.id,
    input.content,
    input.timeToComplete ?? null,
    input.device ?? 'unknown',
  )

  await repository.incrementSubmissions(form.id)

  return { success: true, data: submission }
}
