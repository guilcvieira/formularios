'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { BsFileEarmarkPlus } from 'react-icons/bs';
import { ImSpinner2 } from 'react-icons/im';
import { Button } from './ui/button';

import { CreateForm } from '@actions/form';
import { formSchema, FormSchema } from '@/schemas/form.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

function CreateFormBtn() {
  const router = useRouter();
  const { t } = useTranslation();
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormSchema) => {
    try {
      const formId = await CreateForm(data);
      toast.success(t('createForm.successTitle'), {
        description: t('createForm.successDescription', { id: formId }),
      });
      form.reset();

      router.push(`/builder/${formId}`);
    } catch (error) {
      toast.error(t('createForm.errorTitle'), {
        description:
          error instanceof Error
            ? error.message
            : t('createForm.errorDescription'),
      });
      toast;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'outline'}
          className="group flex h-[190px] flex-col items-center justify-center border border-dashed hover:cursor-pointer"
        >
          <BsFileEarmarkPlus className="text-muted-foreground group-hover:text-primary h-8 w-8" />
          <p className="text-muted-foreground group-hover:text-primary/80 text-xl">
            {t('createForm.cardCta')}
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('createForm.dialogTitle')}</DialogTitle>
          <DialogDescription>
            {t('createForm.dialogDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            action=""
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('createForm.name')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('createForm.description')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('createForm.descriptionPlaceholder')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="mt-4">
                {form.formState.isSubmitting ? (
                  <ImSpinner2 className="animate-spin" />
                ) : (
                  <BsFileEarmarkPlus className="mr-2" />
                )}
                {form.formState.isSubmitting
                  ? t('createForm.creating')
                  : t('createForm.submit')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateFormBtn;
