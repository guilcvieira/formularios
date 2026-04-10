import React from 'react';
import { IconType } from 'react-icons/lib';
import { ParagraphFieldFormElement } from './fields/ParagraphField';
import { SubtitleFieldFormElement } from './fields/SubtitleField';
import { TextFieldFormElement } from './fields/TextField';
import { TitleFieldFormElement } from './fields/TitleField';
import { SeparatorFieldFormElement } from './fields/SeparatorField';
import { SpacerFieldFormElement } from './fields/SpacerField';

export type ElementType =
  | 'TextField'
  | 'TitleField'
  | 'SubtitleField'
  | 'ParagraphField'
  | 'SeparatorField'
  | 'SpacerField';
export type SubmitFunction = (key: string, value: string) => void;

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

  formComponent: React.FC<{
    element: FormElementInstance;
    submitValue?: SubmitFunction;
    isInvalid?: boolean;
    defaultValue?: string;
  }>;

  propertiesComponent: React.FC<{
    element: FormElementInstance;
  }>;

  validateFormElement: (
    element: FormElementInstance,
    currentValue: string,
  ) => boolean;
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
  TitleField: TitleFieldFormElement,
  SubtitleField: SubtitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
};
