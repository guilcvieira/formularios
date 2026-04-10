import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  ElementType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from '../FormElements';
import useDesigner from '../hooks/useDesigner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

import { LuHeading2 } from 'react-icons/lu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';

const type: ElementType = 'SubtitleField';

const propertiesSchema = z.object({
  title: z.string().min(1).max(50),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

const extraAttributes = {
  title: 'Subtitle Field',
};

export const SubtitleFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),

  designerBtnElement: {
    label: 'Subtitle Field',
    icon: LuHeading2,
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validateFormElement: () => true,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({ element }: { element: FormElementInstance }) {
  const customElement = element as CustomInstance;

  const { title } = customElement.extraAttributes;
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-muted-foreground">Subtitle Field</Label>
      <p className="text-lg">{title}</p>
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
      title: customElement.extraAttributes.title,
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle</FormLabel>
              <FormControl>
                <Input
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
      </form>
    </Form>
  );
}

function FormComponent({ element }: { element: FormElementInstance }) {
  const customElement = element as CustomInstance;
  const { title } = customElement.extraAttributes;

  return <p className="text-lg">{title}</p>;
}
