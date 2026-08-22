import type { FormRepository } from '@/repositories/form-repository'
import type { Form } from '@/domain/entities'

interface CreateFormInput {
  userId: string
  name: string
  description: string
}

type CreateFormResult =
  | { success: true; data: Form }
  | { success: false; error: string }

export async function createForm(
  repository: FormRepository,
  input: CreateFormInput,
): Promise<CreateFormResult> {
  if (!input.name || input.name.trim().length === 0) {
    return { success: false, error: 'Form name is required' }
  }

  if (!input.userId) {
    return { success: false, error: 'User ID is required' }
  }

  const form = await repository.create({
    userId: input.userId,
    name: input.name,
    description: input.description ?? '',
  })

  return { success: true, data: form }
}
