import React, { useTransition } from 'react';
import { Button } from './ui/button';
import { MdOutlinePublish } from 'react-icons/md';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { FaIcons } from 'react-icons/fa';
import { toast } from 'sonner';
import { PublishForm } from '@actions/form';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function PublishFormBtn({ id }: { id: number }) {
  const { t } = useTranslation();
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  async function publishForm() {
    try {
      await PublishForm(id)
        .then(() => {
          toast.success(t('publish.success'));
        })
        .finally(() => {
          router.refresh();
        });
    } catch (error) {
      toast.error(t('publish.error'));
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2" variant="default">
          <MdOutlinePublish className="h-6 w-6" />
          {t('publish.button')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('publish.confirmTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('publish.confirmDescription')}
            <br />
            <span className="font-medium">
              {t('publish.confirmWarning')}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('publish.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={(e) => {
              e.preventDefault();
              // Add your publish logic here
              console.log('Form published');
              startTransition(publishForm);
            }}
          >
            {t('publish.confirm')}
            {loading && <FaIcons className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
