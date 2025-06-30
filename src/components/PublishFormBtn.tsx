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

export default function PublishFormBtn({ id }: { id: number }) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  async function publishForm() {
    try {
      await PublishForm(id)
        .then(() => {
          toast.success('Form published successfully!');
        })
        .finally(() => {
          router.refresh();
        });
    } catch (error) {
      toast.error('Failed to publish form. Please try again later.');
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2" variant="default">
          <MdOutlinePublish className="h-6 w-6" />
          Publish Form
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure? </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to publish this form?
            <br />
            <span className="font-medium">
              Once published, it will be available for users to fill out.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
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
            Publish
            {loading && <FaIcons className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
