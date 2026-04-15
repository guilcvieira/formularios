import { GetFormWithSubissions } from '@actions/form';
import { ElementType, FormElementInstance } from '@/components/FormElements';
import { SubmissionsDataTable } from './SubmissionsDataTable';

export async function SubmissionsTable({
  formId,
  t,
}: {
  formId: string;
  t: (key: string) => string;
}) {
  const form = await GetFormWithSubissions(Number(formId));

  if (!form) {
    return <p>{t('formDetails.noSubmissions')}</p>;
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[];

  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case 'TextField':
        const attrs = element.extraAttributes as
          | { label?: string; required?: boolean }
          | undefined;

        columns.push({
          id: element.id,
          label: attrs?.label ?? '',
          required: attrs?.required ?? false,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  const rows = form.FormSubmission.map((submission) => {
    const content = JSON.parse(submission.content);
    return {
      ...content,
      submittedAt: submission.createdAt.toISOString(),
    };
  });

  return (
    <>
      <h2 className="text-muted-foreground my-4 text-2xl font-bold">
        {t('formDetails.submissions')}
      </h2>
      <SubmissionsDataTable
        columns={columns}
        rows={rows}
        labels={{
          search: t('dataTable.search'),
          noResults: t('dataTable.noResults'),
          page: t('dataTable.page'),
          of: t('dataTable.of'),
          first: t('dataTable.first'),
          previous: t('dataTable.previous'),
          next: t('dataTable.next'),
          last: t('dataTable.last'),
          submittedAt: t('formDetails.submittedAt'),
        }}
      />
    </>
  );
}
