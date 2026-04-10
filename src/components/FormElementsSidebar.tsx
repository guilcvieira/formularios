import React from 'react';
import SidebarBtnElement from './SidebarBtnElement';
import { FormElements } from './FormElements';
import { Separator } from './ui/separator';

export default function FormElementsSidebar() {
  return (
    <div>
      <p className="text-muted-foregroun/70 text-sm">Form Elements</p>
      <Separator className="my-2" />
      <p className="text-muted-foreground col-span-1 my-2 text-sm md:col-span-2">
        Layout elements
      </p>
      <div className="grid grid-cols-1 justify-items-center gap-2 place-self-start md:grid-cols-2">
        <SidebarBtnElement formElement={FormElements.TitleField} />
        <SidebarBtnElement formElement={FormElements.SubtitleField} />
        <SidebarBtnElement formElement={FormElements.ParagraphField} />
        <SidebarBtnElement formElement={FormElements.SeparatorField} />
        <SidebarBtnElement formElement={FormElements.SpacerField} />
      </div>
      <p className="text-muted-foreground col-span-1 my-2 text-sm md:col-span-2">
        Form elements
      </p>
      <div className="grid grid-cols-1 justify-items-center gap-2 place-self-start md:grid-cols-2">
        <SidebarBtnElement formElement={FormElements.TextField} />
      </div>
    </div>
  );
}
