import { Active, DragOverlay, useDndMonitor } from '@dnd-kit/core';
import { useState } from 'react';
import { ElementType, FormElements } from './FormElements';
import { SidebarBtnElementDragOverlay } from './SidebarBtnElement';
import useDesigner from './hooks/useDesigner';

export default function DragOverlayWrapper() {
  const { elements } = useDesigner();
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);

  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: (event) => {
      setDraggedItem(null);
    },
  });

  if (!draggedItem) {
    return null;
  }
  let node = (
    <div className="flex h-16 w-64 items-center justify-center rounded-md border bg-white shadow-md">
      <span className="text-sm font-medium text-gray-700">Dragging Item</span>
    </div>
  );

  const isDesignerBtnElement = draggedItem.data?.current?.isDesignerBtnElement;

  if (isDesignerBtnElement) {
    const type = draggedItem.data?.current?.type as ElementType;
    node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />;
  }

  const isDesignerElement = draggedItem.data?.current?.isDesignerElement;

  if (isDesignerElement) {
    const elementId = draggedItem.data?.current?.elementId;
    const element = elements.find((el) => el.id === elementId);

    if (!element) {
      node = (
        <div className="bg-destructive flex h-16 w-64 items-center justify-center rounded-md border shadow-md">
          <span className="text-sm font-medium text-white">
            Element not found
          </span>
        </div>
      );
    } else {
      const DesignerElement = FormElements[element.type].designerComponent;
      node = (
        <div className="bg-accent pointer-events-none flex h-[120px] w-full items-center rounded-md px-4 py-2 opacity-80">
          <DesignerElement element={element} />
        </div>
      );
    }
  }

  return <DragOverlay>{node}</DragOverlay>;
}
