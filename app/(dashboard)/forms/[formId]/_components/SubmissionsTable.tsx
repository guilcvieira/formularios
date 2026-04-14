import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GetFormWithSubissions } from '@actions/form';
import { formatDistance } from 'date-fns';
import { ElementType, FormElementInstance } from '@/components/FormElements';

type Row = {
  [key: string]: string | number | boolean;
} & {
  submittedAt: Date;
};

function RowCell({
  type: _type,
  value,
}: {
  type: ElementType;
  value: string | number | boolean;
}) {
  return <TableCell>{value}</TableCell>;
}

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

  const rows: Row[] = [];
  form.FormSubmission.forEach((submission) => {
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      submittedAt: submission.createdAt,
    });
  });

  return (
    <>
      <h1>{t('formDetails.submissions')}</h1>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className="text-muted-foreground uppercase"
                >
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">
                {t('formDetails.submittedAt')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
