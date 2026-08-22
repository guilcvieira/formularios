import type { FormRepository } from '@/repositories/form-repository'
import type { Form } from '@/domain/entities'

interface GetFormByIdInput {
  formId: number
  userId: string
}

type GetFormByIdResult =
  | { success: true; data: Form }
  | { success: false; error: string }

export async function getFormById(
  repository: FormRepository,
  input: GetFormByIdInput,
): Promise<GetFormByIdResult> {
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

  return { success: true, data: form }
}
