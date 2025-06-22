import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { HiSaveAs } from 'react-icons/hi';
import useDesigner from './hooks/useDesigner';
import { UpdateFormContent } from '@actions/form';
import { toast } from 'sonner';
import { ImSpinner2 } from 'react-icons/im';

export default function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      await UpdateFormContent(id, jsonElements);

      toast.success('Form saved successfully', {
        description: 'Your form has been saved.',
      });
    } catch (error) {
      toast.error('Failed to save form', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred.',
      });
    }
  };

  return (
    <Button
      className="gap-2"
      variant="outline"
      onClick={() => startTransition(updateFormContent)}
      disabled={loading}
    >
      <HiSaveAs className="h-6 w-6" />
      Save Form
      {loading && <ImSpinner2 className="h-6 w-6 animate-spin" />}
    </Button>
  );
}
