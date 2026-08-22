import type { FormRepository } from '@/repositories/form-repository'
import type { FormElementInstance } from '@/domain/entities'
import { formContentSchema } from '@/domain/schemas/form-content'

interface UpdateFormContentInput {
  formId: number
  userId: string
  content: FormElementInstance[]
}

type UpdateFormContentResult =
  | { success: true; data: null }
  | { success: false; error: string }

export async function updateFormContent(
  repository: FormRepository,
  input: UpdateFormContentInput,
): Promise<UpdateFormContentResult> {
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

  if (form.published) {
    return { success: false, error: 'Cannot edit a published form' }
  }

  const validation = formContentSchema.safeParse(input.content)
  if (!validation.success) {
    return { success: false, error: 'Invalid form content' }
  }

  await repository.updateContent(input.formId, input.content)
  return { success: true, data: null }
}
