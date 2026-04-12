'use client';

import { cn } from '@/lib/utils';
import { useDraggable } from '@dnd-kit/core';
import { FormElement } from './FormElements';
import { Button } from './ui/button';
import { useTranslation } from 'react-i18next';

const fieldTranslationKey: Record<FormElement['type'], string> = {
  TextField: 'fields.textField',
  TitleField: 'fields.titleField',
  SubtitleField: 'fields.subtitleField',
  ParagraphField: 'fields.paragraphField',
  SeparatorField: 'fields.separatorField',
  SpacerField: 'fields.spacerField',
};

export default function SidebarBtnElement({
  formElement,
}: {
  formElement: FormElement;
}) {
  const { t } = useTranslation();
  const { label, icon: Icon } = formElement.designerBtnElement;
  const translatedLabel = t(fieldTranslationKey[formElement.type], {
    defaultValue: label,
  });
  const draggable = useDraggable({
    id: 'designer-btn-' + formElement.type,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });
  return (
    <Button
      ref={draggable.setNodeRef}
      variant="outline"
      className={cn(
        'flex h-[120px] w-[120px] flex-col items-center gap-2',
        draggable.isDragging && 'ring-primary ring-2',
      )}
      {...draggable.attributes}
      {...draggable.listeners}
    >
      <Icon className="text-primary size-8 cursor-grab" />
      <p className="text-xs">{translatedLabel}</p>
    </Button>
  );
}

export function SidebarBtnElementDragOverlay({
  formElement,
}: {
  formElement: FormElement;
}) {
  const { t } = useTranslation();
  const { label, icon: Icon } = formElement.designerBtnElement;
  const translatedLabel = t(fieldTranslationKey[formElement.type], {
    defaultValue: label,
  });
  const draggable = useDraggable({
    id: 'designer-btn-' + formElement.type,
    data: {
      type: formElement.type,
      isDesignerBtnElement: true,
    },
  });
  return (
    <Button
      variant="outline"
      className="flex h-[120px] w-[120px] flex-col items-center gap-2"
    >
      <Icon className="text-primary size-8 cursor-grab" />
      <p className="text-xs">{translatedLabel}</p>
    </Button>
  );
}
