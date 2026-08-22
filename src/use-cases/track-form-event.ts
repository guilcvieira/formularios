import type { FormRepository } from '@/repositories/form-repository'

interface TrackFormEventInput {
  formUrl: string
  sessionId: string
  type: 'form_start' | 'field_interaction' | 'field_error' | 'form_abandon'
  fieldId?: string
  metadata?: Record<string, unknown>
}

type TrackFormEventResult =
  | { success: true; data: null }
  | { success: false; error: string }

export async function trackFormEvent(
  repository: FormRepository,
  input: TrackFormEventInput,
): Promise<TrackFormEventResult> {
  if (!input.formUrl) {
    return { success: false, error: 'Form URL is required' }
  }

  if (!input.sessionId) {
    return { success: false, error: 'Session ID is required' }
  }

  const form = await repository.findByShareUrl(input.formUrl)

  if (!form || !form.published) {
    return { success: false, error: 'Form not found' }
  }

  await repository.createEvent(
    form.id,
    input.sessionId,
    input.type,
    input.fieldId ?? null,
    input.metadata ?? null,
  )

  return { success: true, data: null }
}
