import { FormElementInstance } from '@/components/FormElements';
import FormSubmitComponent from '@/components/FormSubmitComponent';
import { GetFormContentByURL } from '@actions/form';

export default async function SubmitPage({
  params,
}: {
  params: Promise<{ formUrl: string }>;
}) {
  const { formUrl } = await params;

  const form = await GetFormContentByURL(formUrl);

  if (!form) {
    throw new Error('Form not found');
  }

  console.log('SubmitPage:', formUrl);

  const formContent = JSON.parse(form.content) as FormElementInstance[];

  return <FormSubmitComponent formUrl={formUrl} content={formContent} />;
}
