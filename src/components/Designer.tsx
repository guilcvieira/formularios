'use client';
import { generateUniqueId } from '@/lib/id-generator';
import { cn } from '@/lib/utils';
import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core';
import DesignerSidebar from './DesignerSidebar';
import { ElementType, FormElementInstance, FormElements } from './FormElements';
import useDesigner from './hooks/useDesigner';
import { useState } from 'react';
import { Button } from './ui/button';
import { BiSolidTrash } from 'react-icons/bi';

export default function Designer() {
  const {
    elements,
    addElement,
    setSelectedElement,
    selectedElement,
    removeElement,
  } = useDesigner();
  const droppable = useDroppable({
    id: 'designer',
    data: {
      isDesignerDropArea: true,
    },
  });
  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;

      // Adicionando elemento quando o botão da sidebar é solto sobre a área de drop do designer
      const isDroppingOverDesignerDropArea =
        over.data?.current?.isDesignerDropArea;

      const droppingSidebarBrnOverDesignerDropArea =
        isDesignerBtnElement && isDroppingOverDesignerDropArea;

      if (droppingSidebarBrnOverDesignerDropArea) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementType].construct(
          generateUniqueId(type),
        );

        addElement(elements.length, newElement);
        return;
      }

      // Adicionando elemento quando o botão da sidebar é solto sobre um elemento do designer
      const isdroppingOverDesignerElementTopHalf =
        over.data?.current?.isTopHalfDesignerElement;

      const isdroppingOverDesignerElementBottomHalf =
        over.data?.current?.isBottomHalfDesignerElement;

      const isDroppingOverDesignerElement =
        isdroppingOverDesignerElementTopHalf ||
        isdroppingOverDesignerElementBottomHalf;

      const droppingSidebarBtnOverDesignerElement =
        isDesignerBtnElement && isDroppingOverDesignerElement;

      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementType].construct(
          generateUniqueId(type),
        );

        const overId = over.data.current?.elementId;
        const overElementIndex = elements.findIndex((el) => el.id === overId);

        if (overElementIndex === -1) return;

        let indexForNewElement = overElementIndex;

        if (isdroppingOverDesignerElementTopHalf) {
          indexForNewElement = overElementIndex;
        } else if (isdroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }

        addElement(indexForNewElement, newElement);

        return;
      }

      // Adicionando elemento quando um elemento do designer é arrastado
      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;
      const draggingDesignerElementOverAnotherDesignerElement =
        isDroppingOverDesignerElement && isDraggingDesignerElement;

      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data.current?.elementId;
        const overId = over.data.current?.elementId;

        console.log('DEBUG: activeId', activeId);
        console.log('DEBUG: overId', overId);

        const activeElementIndex = elements.findIndex(
          (el) => el.id === activeId,
        );

        const overElementIndex = elements.findIndex((el) => el.id === overId);

        if (activeElementIndex === -1 || overElementIndex === -1) return;

        const activeElement = { ...elements[activeElementIndex] };

        removeElement(activeId);

        let indexForNewElement = overElementIndex;

        if (isdroppingOverDesignerElementTopHalf) {
          indexForNewElement = overElementIndex;
        } else if (isdroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex;
        }

        addElement(indexForNewElement, activeElement);

        return;
      }
    },
  });
  return (
    <div className="flex h-full w-full">
      <div
        className="w-full p-4"
        onClick={(e) => {
          e.stopPropagation();
          if (selectedElement) setSelectedElement(null);
        }}
      >
        <div
          ref={droppable.setNodeRef}
          data-testid="designer-drop-area"
          className={cn(
            droppable.isOver && 'ring-primary/20 ring-2',
            'bg-background m-auto flex h-full max-w-4xl flex-1 flex-grow flex-col items-center justify-start gap-2 overflow-y-auto rounded-xl p-4',
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            <p className="text-muted-foreground flex flex-grow items-center text-3xl font-bold">
              Drop Here
            </p>
          )}

          {elements.length > 0 && (
            <div className="text-background flex w-full flex-col gap-2">
              {elements.map((element) => (
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}

          {droppable.isOver && (
            <div className="w-full">
              <div className="bg-accent h-[120px] rounded-md"></div>
            </div>
          )}
        </div>
      </div>
      <DesignerSidebar />
    </div>
  );
}

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  const { removeElement, selectedElement, setSelectedElement } = useDesigner();
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);

  const topHalf = useDroppable({
    id: element.id + '-top',
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + '-bottom',
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + '-drag-handler',
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });

  if (draggable.isDragging) return null;

  const DesignerElement = FormElements[element.type].designerComponent;

  return (
    <div
      ref={draggable.setNodeRef}
      className={cn(
        'text-foreground ring-accent relative flex flex-col gap-2 rounded-md ring-1 ring-inset hover:cursor-pointer',
        selectedElement?.id === element.id &&
          'ring-offset-foreground ring-2 ring-offset-2',
      )}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
      {...draggable.attributes}
      {...draggable.listeners}
    >
      <div
        ref={topHalf.setNodeRef}
        className={cn(
          'absolute top-0 h-1/2 w-full rounded-t-md',
          topHalf.isOver && 'border-foreground border-t-4',
        )}
      />
      <div
        ref={bottomHalf.setNodeRef}
        className={cn(
          'absolute bottom-0 h-1/2 w-full rounded-b-md',
          bottomHalf.isOver && 'border-foreground border-b-4',
        )}
      />

      {mouseIsOver && (
        <>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <p className="text-muted-foreground animate-pulse text-sm">
              Click for properties or Drag to move
            </p>
          </div>

          <div className="absolute right-0 h-full">
            <Button
              variant="destructive"
              className="h-full rounded-md rounded-l-none border hover:cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
            >
              <BiSolidTrash className="size-6" />
            </Button>
          </div>
        </>
      )}

      <div
        className={cn(
          'bg-accent/60 pointer-events-none flex h-[120px] w-full items-center rounded-md px-4 py-2 opacity-100',
          mouseIsOver && 'opacity-30',
        )}
      >
        <DesignerElement element={element} />
      </div>
    </div>
  );
}
