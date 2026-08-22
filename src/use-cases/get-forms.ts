import type { FormRepository } from '@/repositories/form-repository'
import type { Form } from '@/domain/entities'

interface GetFormsInput {
  userId: string
}

type GetFormsResult =
  | { success: true; data: Form[] }
  | { success: false; error: string }

export async function getForms(
  repository: FormRepository,
  input: GetFormsInput,
): Promise<GetFormsResult> {
  if (!input.userId) {
    return { success: false, error: 'User ID is required' }
  }

  const forms = await repository.findByUserId(input.userId)
  return { success: true, data: forms }
}
