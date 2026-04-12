import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  ElementType,
  FormElement,
  FormElementInstance,
  SubmitFunction,
} from '../FormElements';
import useDesigner from '../hooks/useDesigner';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  spacerFieldPropertiesSchema,
  type SpacerFieldPropertiesSchemaType,
} from '@/shared/schemas/forms/fields/spacer-field.schema';

import { LuHeading1, LuSeparatorHorizontal } from 'react-icons/lu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Slider } from '../ui/slider';

const type: ElementType = 'SpacerField';

const extraAttributes = {
  height: 20,
};

export const SpacerFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),

  designerBtnElement: {
    label: 'Spacer Field',
    icon: LuSeparatorHorizontal,
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

  const { height } = customElement.extraAttributes;
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <Label className="text-muted-foreground">Spacer Field: {height}px</Label>
      <LuSeparatorHorizontal className="h-8 w-8" />
    </div>
  );
}

function PropertiesComponent({ element }: { element: FormElementInstance }) {
  const { updateElement } = useDesigner();
  const customElement = element as CustomInstance;

  const form = useForm<SpacerFieldPropertiesSchemaType>({
    resolver: zodResolver(spacerFieldPropertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      height: customElement.extraAttributes.height,
    },
  });

  useEffect(() => {
    form.reset(customElement.extraAttributes);
  }, [customElement, form]);

  const applyChanges = (data: SpacerFieldPropertiesSchemaType) => {
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
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height : {form.watch('height')}px</FormLabel>
              <FormControl>
                <Slider
                  className="pt-2"
                  value={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                  min={5}
                  max={200}
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
  const { height } = customElement.extraAttributes;

  return <div style={{ height }} className="w-full bg-transparent"></div>;
}
