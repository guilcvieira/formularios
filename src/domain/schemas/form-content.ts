import { z } from 'zod'

export const formElementInstanceSchema = z.object({
  id: z.string(),
  type: z.string(),
  extraAttributes: z.record(z.unknown()).optional(),
})

export const formContentSchema = z.array(formElementInstanceSchema)

export const submissionContentSchema = z.record(z.string(), z.string())
