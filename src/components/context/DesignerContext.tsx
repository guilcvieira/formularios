'use client';

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import { FormElementInstance } from '../FormElements';

type DesignerContextType = {
  elements: FormElementInstance[];
  addElement: (index: number, element: FormElementInstance) => void;
  removeElement: (id: string) => void;

  selectedElement: FormElementInstance | null;
  setSelectedElement: (element: FormElementInstance | null) => void;

  updateElement: (id: string, element: FormElementInstance) => void;

  setElements: React.Dispatch<React.SetStateAction<FormElementInstance[]>>;
};

export const DesignerContext = createContext<DesignerContextType | null>(null);

export default function DesignerContextProvider({
  children,
}: PropsWithChildren) {
  const [elements, setElements] = useState<FormElementInstance[]>([]);
  const [selectedElement, setSelectedElement] =
    useState<FormElementInstance | null>(null);

  const addElement = (index: number, element: FormElementInstance) => {
    setElements((prevElements) => {
      const newElements = [...prevElements];
      newElements.splice(index, 0, element);
      return newElements;
    });
  };

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((element) => element.id !== id));
  };

  const updateElement = (id: string, element: FormElementInstance) => {
    setElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, ...element } : el)),
    );
  };

  return (
    <DesignerContext.Provider
      value={{
        elements,
        addElement,
        removeElement,
        selectedElement,
        setSelectedElement,
        updateElement,
        setElements,
      }}
    >
      {children}
    </DesignerContext.Provider>
  );
}
