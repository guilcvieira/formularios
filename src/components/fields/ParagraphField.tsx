import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ElementType, FormElement, FormElementInstance } from '../FormElements';
import useDesigner from '../hooks/useDesigner';
import { Label } from '../ui/label';

import { BsTextParagraph } from 'react-icons/bs';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';

const type: ElementType = 'ParagraphField';

const propertiesSchema = z.object({
  text: z.string().min(1).max(500),
  size: z.number().min(5).max(200).optional(),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

const extraAttributes = {
  text: 'Enter your text here',
  size: 16,
};

export const ParagraphFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),

  designerBtnElement: {
    label: 'Paragraph Field',
    icon: BsTextParagraph,
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validateFormElement(
    formElement: FormElementInstance,
    currentValue: string,
  ): boolean {
    const element = formElement as CustomInstance;
    if (element.extraAttributes.required) {
      console.log(
        'Validating required field:',
        element.extraAttributes.label,
        'Value:',
        currentValue,
        'Valid:',
        !!(currentValue && currentValue.trim().length > 0),
      );
      return !!(currentValue && currentValue.trim().length > 0);
    }
    return true;
  },
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({ element }: { element: FormElementInstance }) {
  const customElement = element as CustomInstance;

  const { text } = customElement.extraAttributes;
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-muted-foreground">Paragraph Field</Label>
      <p>{text}</p>
    </div>
  );
}

function PropertiesComponent({ element }: { element: FormElementInstance }) {
  const { updateElement } = useDesigner();
  const customElement = element as CustomInstance;

  const form = useForm<PropertiesSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      text: customElement.extraAttributes.text,
    },
  });

  useEffect(() => {
    form.reset(customElement.extraAttributes);
  }, [customElement, form]);

  const applyChanges = (data: PropertiesSchemaType) => {
    updateElement(element.id, {
      ...customElement,
      extraAttributes: { ...data },
    });
  };

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => e.preventDefault()}
        className="space-y-with-divide-4"
      >
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.currentTarget.blur();
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font Size: {form.watch('size')}px</FormLabel>
              <FormControl>
                <input
                  type="number"
                  min={8}
                  max={200}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function FormComponent({ element }: { element: FormElementInstance }) {
  const customElement = element as CustomInstance;

  const { text, size } = customElement.extraAttributes;

  return (
    <p
      style={{
        fontSize: `${size}px`,
      }}
    >
      {text}
    </p>
  );
}
