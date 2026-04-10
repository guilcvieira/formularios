import { ElementType, FormElement, FormElementInstance } from '../FormElements';
import { Label } from '../ui/label';

import { RiSeparator } from 'react-icons/ri';
import { Separator } from '../ui/separator';

const type: ElementType = 'SeparatorField';

export const SeparatorFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
  }),

  designerBtnElement: {
    label: 'Separator Field',
    icon: RiSeparator,
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validateFormElement: () => true,
};

function DesignerComponent({ element }: { element: FormElementInstance }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label className="text-muted-foreground">Separator Field</Label>
      <Separator />
    </div>
  );
}

function PropertiesComponent() {
  return <p>No properties available for this element.</p>;
}

function FormComponent() {
  return <Separator />;
}
