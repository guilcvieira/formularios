import React from 'react';
import { TextFieldFormElement } from './fields/TextField';
import { IconType } from 'react-icons/lib';

export type ElementType = 'TextField';

export interface FormElement {
  type: ElementType;

  construct: (id: string) => FormElementInstance;

  designerBtnElement: {
    label: string;
    icon: IconType;
  };

  designerComponent: React.FC<{
    element: FormElementInstance;
  }>;
  formComponent: React.FC;
  propertiesComponent: React.FC;
}

export interface FormElementInstance {
  id: string;
  type: ElementType;
  extraAttributes?: Record<string, any>;
}

type FormElementsType = {
  [key in ElementType]: FormElement;
};

export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
};
