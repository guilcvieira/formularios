import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { HiSaveAs } from 'react-icons/hi';
import useDesigner from './hooks/useDesigner';
import { UpdateFormContent } from '@actions/form';
import { toast } from 'sonner';
import { ImSpinner2 } from 'react-icons/im';
import { useTranslation } from 'react-i18next';

export default function SaveFormBtn({ id }: { id: number }) {
  const { t } = useTranslation();
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      await UpdateFormContent(id, jsonElements);

      toast.success(t('save.success'), {
        description: t('save.savedDescription'),
      });
    } catch (error) {
      toast.error(t('save.error'), {
        description:
          error instanceof Error ? error.message : t('generic.unexpectedError'),
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
      {t('save.button')}
      {loading && <ImSpinner2 className="h-6 w-6 animate-spin" />}
    </Button>
  );
}
