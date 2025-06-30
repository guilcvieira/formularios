import FormLinkShare from '@/components/FormLinkShare';
import VisitBtn from '@/components/VisitBtn';
import { GetFormById } from '@actions/form';
import { StatsCard } from '../../page';
import { LuView } from 'react-icons/lu';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { TbArrowBounce } from 'react-icons/tb';

async function FormDetailPage({ params }: { params: { formId: string } }) {
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
    <>
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
    </>
  );
}

export default FormDetailPage;

function SubmissionsTable({ formId }: { formId: string }) {
  return (
    <>
      <h1>Submissions for Form ID: {formId}</h1>
    </>
  );
}
