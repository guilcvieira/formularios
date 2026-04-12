import FormLinkShare from '@/components/FormLinkShare';
import VisitBtn from '@/components/VisitBtn';
import { GetFormById, GetFormWithSubissions } from '@actions/form';
import { StatsCard } from '../../page';
import { LuView } from 'react-icons/lu';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { TbArrowBounce } from 'react-icons/tb';
import { ElementType, FormElementInstance } from '@/components/FormElements';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistance } from 'date-fns';

async function FormDetailPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;
  const form = await GetFormById(Number(formId));

  if (!form) {
    throw new Error('Form not found');
  }

  const { visits, submissions } = form;

  let submissionRate = 0;
  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="border-muted w-full border-y py-10">
        <div className="container mx-auto flex w-full justify-between self-center">
          <h1 className="truncate text-4xl font-bold">{form.name}</h1>
          <VisitBtn shareUrl={form.shareUrl} />
        </div>
      </div>
      <div className="border-muted w-full border-b py-4">
        <div className="container mx-auto flex items-center justify-between gap-2">
          <FormLinkShare shareUrl={form.shareUrl} />
        </div>
      </div>

      <div className="container mx-auto grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Visits"
          icon={<LuView className="text-blue-600" />}
          helperText="All time form visits"
          value={visits?.toLocaleString()}
          loading={false}
          className="gap-4 shadow shadow-blue-600"
        />

        <StatsCard
          title="Total Submissions"
          icon={<FaWpforms className="text-yellow-600" />}
          helperText="All time form submissions"
          value={submissions?.toLocaleString()}
          loading={false}
          className="gap-4 shadow shadow-yellow-600"
        />

        <StatsCard
          title="Submission rate"
          icon={<HiCursorClick className="text-green-600" />}
          helperText="Visistes that resulted in a submission"
          value={submissionRate?.toLocaleString() + '%' || ''}
          loading={false}
          className="gap-4 shadow shadow-green-600"
        />

        <StatsCard
          title="Bounce rate"
          icon={<TbArrowBounce className="text-red-600" />}
          helperText="Visistes that leave without interaction"
          value={bounceRate?.toLocaleString() + '%' || ''}
          loading={false}
          className="gap-4 shadow shadow-red-600"
        />
      </div>

      <div className="container mx-auto w-full pt-10">
        <SubmissionsTable formId={formId} />
      </div>
    </div>
  );
}

export default FormDetailPage;

type Row = {
  [key: string]: string | number | boolean;
} & {
  submittedAt: Date;
};

async function SubmissionsTable({ formId }: { formId: string }) {
  const form = await GetFormWithSubissions(Number(formId));

  if (!form) {
    return <p>No submissions found for this form.</p>;
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
      <h1>Submissions</h1>

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
                Submitted At
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

function RowCell({
  type: _type,
  value,
}: {
  type: ElementType;
  value: string | number | boolean;
}) {
  return <TableCell>{value}</TableCell>;
}
