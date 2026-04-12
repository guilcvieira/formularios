import { z } from 'zod';

export const textFieldPropertiesSchema = z.object({
  label: z.string().min(1).max(50),
  helperText: z.string().max(200),
  required: z.boolean(),
  placeholder: z.string().max(50),
});

export type TextFieldPropertiesSchemaType = z.infer<
  typeof textFieldPropertiesSchema
>;
