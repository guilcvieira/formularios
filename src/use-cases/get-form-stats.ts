import type { FormRepository } from '@/repositories/form-repository'
import type { FormStats } from '@/domain/entities'

interface GetFormStatsInput {
  userId: string
}

type GetFormStatsResult =
  | { success: true; data: FormStats }
  | { success: false; error: string }

export async function getFormStats(
  repository: FormRepository,
  input: GetFormStatsInput,
): Promise<GetFormStatsResult> {
  if (!input.userId) {
    return { success: false, error: 'User ID is required' }
  }

  const stats = await repository.getStats(input.userId)
  return { success: true, data: stats }
}
