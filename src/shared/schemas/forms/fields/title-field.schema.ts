import { z } from 'zod';

export const titleFieldPropertiesSchema = z.object({
  title: z.string().min(1).max(50),
});

export type TitleFieldPropertiesSchemaType = z.infer<
  typeof titleFieldPropertiesSchema
>;
