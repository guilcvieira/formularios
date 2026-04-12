import { z } from 'zod';

export const subtitleFieldPropertiesSchema = z.object({
  title: z.string().min(1).max(50),
});

export type SubtitleFieldPropertiesSchemaType = z.infer<
  typeof subtitleFieldPropertiesSchema
>;
