import { getServerT } from '@/lib/server-i18n';
import { FormCard } from './FormCard';
import { GetForms } from '@actions/form';

export async function FormCardList() {
  const forms = await GetForms();
  const t = await getServerT();

  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} t={t} />
      ))}
    </>
  );
}
