import type { FormRepository } from '@/repositories/form-repository'
import type { FormElementInstance } from '@/domain/entities'

interface GetFormContentByUrlInput {
  formUrl: string
}

type GetFormContentByUrlResult =
  | { success: true; data: { id: number; content: FormElementInstance[] } }
  | { success: false; error: string }

export async function getFormContentByUrl(
  repository: FormRepository,
  input: GetFormContentByUrlInput,
): Promise<GetFormContentByUrlResult> {
  if (!input.formUrl) {
    return { success: false, error: 'Form URL is required' }
  }

  const form = await repository.findByShareUrl(input.formUrl)

  if (!form) {
    return { success: false, error: 'Form not found' }
  }

  await repository.incrementVisits(form.id)

  return {
    success: true,
    data: {
      id: form.id,
      content: form.content,
    },
  }
}
