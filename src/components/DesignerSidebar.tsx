import React from 'react';
import SidebarBtnElement from './SidebarBtnElement';
import { FormElements } from './FormElements';

export default function DesignerSidebar() {
  return (
    <aside className="border-muted bg-background flex h-full w-[400px] max-w-[400px] flex-grow flex-col gap-2 overflow-y-auto border-l-2 p-4">
      Elements
      <div className="grid grid-cols-2">
        <SidebarBtnElement formElement={FormElements.TextField} />
      </div>
    </aside>
  );
}
