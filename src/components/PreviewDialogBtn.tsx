'use client';

import React from 'react';
import { Button } from './ui/button';
import { MdPreview } from 'react-icons/md';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { FormElements } from './FormElements';
import useDesigner from './hooks/useDesigner';
import { useTranslation } from 'react-i18next';

export default function PreviewDialogBtn() {
  const { t } = useTranslation();
  const { elements } = useDesigner();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2" variant="outline">
          <MdPreview className="h-6 w-6" />
          {t('preview.title')}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-screen max-h-screen w-screen !max-w-screen flex-grow flex-col gap-0 p-0">
        <div className="border-b px-4 py-2">
          <p className="text-muted-foreground text-lg font-bold">
            {t('preview.headerTitle')}
          </p>
          <p className="twxt-sm text-muted-foreground">
            {t('preview.headerDescription')}
          </p>
        </div>
        <div className="bg-accent flex h-full w-full flex-grow flex-col items-center justify-center overflow-y-auto bg-[url(/paper.svg)] p-4 dark:bg-[url(/paper-dark.svg)]">
          <div className="bg-background flex h-full w-full max-w-[620px] flex-grow flex-col gap-4 overflow-y-auto rounded-2xl p-8">
            {elements.map((element) => {
              const FormComponent = FormElements[element.type].formComponent;

              return <FormComponent key={element.id} element={element} />;
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
