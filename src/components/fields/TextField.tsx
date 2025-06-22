import { MdTextFields } from 'react-icons/md';
import { ElementType, FormElement, FormElementInstance } from '../FormElements';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import useDesigner from '../hooks/useDesigner';

import {
  Form,
  FormControl,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Switch } from '../ui/switch';

const type: ElementType = 'TextField';

const propertiesSchema = z.object({
  label: z.string().min(1).max(50),
  helperText: z.string().max(200),
  required: z.boolean(),
  placeholder: z.string().max(50),
});

type PropertiesSchemaType = z.infer<typeof propertiesSchema>;

const extraAttributes = {
  placeholder: 'Enter text here',
  label: 'Text Field',
  helperText: 'This is a text field',
  required: true,
};

export const TextFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),

  designerBtnElement: {
    label: 'Text Field',
    icon: MdTextFields,
  },
  designerComponent: DesignerComponent,
  formComponent: () => <div>form component</div>,
  propertiesComponent: PropertiesComponent,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({ element }: { element: FormElementInstance }) {
  const customElement = element as CustomInstance;

  const { label, placeholder, required, helperText } =
    customElement.extraAttributes;
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-muted-foreground">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      <Input readOnly disabled placeholder={placeholder} className="w-full" />
      {helperText && (
        <p className="text-muted-foreground text-xs">{helperText}</p>
      )}
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
      label: customElement.extraAttributes.label,
      helperText: customElement.extraAttributes.helperText,
      required: customElement.extraAttributes.required,
      placeholder: customElement.extraAttributes.placeholder,
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
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
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
              <FormDescription>Label for the text field</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper Text</FormLabel>
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
              <FormDescription>
                Additional information or instructions for the text field
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  This field is required and must be filled out.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
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
              <FormDescription>Placeholder text for the input</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
