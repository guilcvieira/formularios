import type { FormRepository } from '@/repositories/form-repository'

interface PublishFormInput {
  formId: number
  userId: string
}

type PublishFormResult =
  | { success: true; data: null }
  | { success: false; error: string }

export async function publishForm(
  repository: FormRepository,
  input: PublishFormInput,
): Promise<PublishFormResult> {
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

  await repository.publish(input.formId)
  return { success: true, data: null }
}
