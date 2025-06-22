import React from 'react';
import SidebarBtnElement from './SidebarBtnElement';
import { FormElements } from './FormElements';

export default function FormElementsSidebar() {
  return (
    <div>
      Elements
      <div className="grid grid-cols-2">
        <SidebarBtnElement formElement={FormElements.TextField} />
      </div>
    </div>
  );
}
