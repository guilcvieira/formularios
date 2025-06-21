import { MdTextFields } from 'react-icons/md';
import { ElementType, FormElement, FormElementInstance } from '../FormElements';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

const type: ElementType = 'TextField';

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
  propertiesComponent: () => <div>properties Component</div>,
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
