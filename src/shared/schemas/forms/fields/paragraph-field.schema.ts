import { z } from 'zod';

export const paragraphFieldPropertiesSchema = z.object({
  text: z.string().min(1).max(500),
  size: z.number().min(5).max(200).optional(),
});

export type ParagraphFieldPropertiesSchemaType = z.infer<
  typeof paragraphFieldPropertiesSchema
>;
