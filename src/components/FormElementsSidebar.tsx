'use client';

import React from 'react';
import SidebarBtnElement from './SidebarBtnElement';
import { FormElements } from './FormElements';
import { Separator } from './ui/separator';
import { useTranslation } from 'react-i18next';

export default function FormElementsSidebar() {
  const { t } = useTranslation();

  return (
    <div>
      <p className="text-muted-foregroun/70 text-sm">{t('sidebar.formElements')}</p>
      <Separator className="my-2" />
      <p className="text-muted-foreground col-span-1 my-2 text-sm md:col-span-2">
        {t('sidebar.layoutElements')}
      </p>
      <div className="grid grid-cols-1 justify-items-center gap-2 place-self-start md:grid-cols-2">
        <SidebarBtnElement formElement={FormElements.TitleField} />
        <SidebarBtnElement formElement={FormElements.SubtitleField} />
        <SidebarBtnElement formElement={FormElements.ParagraphField} />
        <SidebarBtnElement formElement={FormElements.SeparatorField} />
        <SidebarBtnElement formElement={FormElements.SpacerField} />
      </div>
      <p className="text-muted-foreground col-span-1 my-2 text-sm md:col-span-2">
        {t('sidebar.inputElements')}
      </p>
      <div className="grid grid-cols-1 justify-items-center gap-2 place-self-start md:grid-cols-2">
        <SidebarBtnElement formElement={FormElements.TextField} />
      </div>
    </div>
  );
}
