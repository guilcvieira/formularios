import FormLinkShare from '@/components/FormLinkShare';
import VisitBtn from '@/components/VisitBtn';
import { GetFormById, GetFormWithSubissions } from '@actions/form';
import { GetFormAnalytics } from '@actions/analytics';
import { StatsCard } from '../../_components/StatsCard';
import { LuView } from 'react-icons/lu';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { TbArrowBounce } from 'react-icons/tb';
import { ElementType, FormElementInstance } from '@/components/FormElements';
import { getServerT } from '@/lib/server-i18n';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistance } from 'date-fns';
import { FormAnalyticsCharts } from '@/components/FormAnalyticsCharts';
import { Separator } from '@/components/ui/separator';
import { SubmissionsTable } from './_components/SubmissionsTable';

async function FormDetailPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const t = await getServerT();
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

  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const fieldLabels: Record<string, string> = {};
  formElements.forEach((el) => {
    const attrs = el.extraAttributes as { label?: string } | undefined;
    fieldLabels[el.id] = attrs?.label || el.type;
  });

  const analytics = await GetFormAnalytics(Number(formId));

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
          title={t('dashboard.totalVisits')}
          icon={<LuView className="text-blue-600" />}
          helperText={t('dashboard.allTimeFormVisits')}
          value={visits?.toLocaleString()}
          loading={false}
          className="gap-4 shadow shadow-blue-600"
        />

        <StatsCard
          title={t('dashboard.totalSubmissions')}
          icon={<FaWpforms className="text-yellow-600" />}
          helperText={t('dashboard.allTimeFormSubmissions')}
          value={submissions?.toLocaleString()}
          loading={false}
          className="gap-4 shadow shadow-yellow-600"
        />

        <StatsCard
          title={t('dashboard.submissionRate')}
          icon={<HiCursorClick className="text-green-600" />}
          helperText={t('dashboard.visitorsSubmitted')}
          value={submissionRate?.toLocaleString() + '%' || ''}
          loading={false}
          className="gap-4 shadow shadow-green-600"
        />

        <StatsCard
          title={t('dashboard.bounceRate')}
          icon={<TbArrowBounce className="text-red-600" />}
          helperText={t('dashboard.visitorsLeft')}
          value={bounceRate?.toLocaleString() + '%' || ''}
          loading={false}
          className="gap-4 shadow shadow-red-600"
        />
      </div>

      <div className="container mx-auto w-full pt-6">
        <Separator className="mb-6" />
        <h2 className="mb-4 text-2xl font-bold">{t('analytics.title')}</h2>
        <FormAnalyticsCharts
          data={analytics}
          fieldLabels={fieldLabels}
          labels={{
            avgTimeToComplete: t('analytics.avgTimeToComplete'),
            avgTimeHelper: t('analytics.avgTimeHelper'),
            basedOnSubmissions: t('analytics.basedOnSubmissions'),
            deviceBreakdown: t('analytics.deviceBreakdown'),
            deviceHelper: t('analytics.deviceHelper'),
            desktop: t('analytics.desktop'),
            mobile: t('analytics.mobile'),
            tablet: t('analytics.tablet'),
            submissions: t('analytics.submissions'),
            visits: t('analytics.visits'),
            submissionTimeline: t('analytics.submissionTimeline'),
            timelineHelper: t('analytics.timelineHelper'),
            fieldDropOff: t('analytics.fieldDropOff'),
            dropOffHelper: t('analytics.dropOffHelper'),
            dropOffRate: t('analytics.dropOffRate'),
            fieldErrorRate: t('analytics.fieldErrorRate'),
            errorRateHelper: t('analytics.errorRateHelper'),
            errorRate: t('analytics.errorRate'),
            noData: t('analytics.noData'),
          }}
        />
      </div>

      <div className="container mx-auto w-full pt-10">
        <Separator className="mb-6" />
        <SubmissionsTable formId={formId} t={t} />
      </div>
    </div>
  );
}

export default FormDetailPage;
