import React from 'react';
import useDesigner from './hooks/useDesigner';
import { FormElements } from './FormElements';
import { Button } from './ui/button';
import { AiOutlineClose } from 'react-icons/ai';
import { Separator } from './ui/separator';

export default function PropertiesFormSidebar() {
  const { selectedElement, setSelectedElement } = useDesigner();

  if (!selectedElement) return null;

  const PropertiesComponent =
    FormElements[selectedElement.type]?.propertiesComponent;

  return (
    <div className="flex flex-col p-2">
      <div className="flex items-center justify-between">
        <p className="text-foreground/70 text-sm">Element Properties</p>
        <Button
          size={'icon'}
          variant={'ghost'}
          onClick={() => setSelectedElement(null)}
        >
          <AiOutlineClose />
        </Button>
      </div>
      <Separator className="mb-4" />
      <PropertiesComponent element={selectedElement} />
    </div>
  );
}
