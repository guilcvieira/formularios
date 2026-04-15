import { FormAnalyticsCharts } from '@/components/FormAnalyticsCharts';
import { GetFormAnalytics } from '@actions/analytics';
import { StatsCard } from '../../../_components/StatsCard';
import { LuView } from 'react-icons/lu';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { TbArrowBounce } from 'react-icons/tb';

interface FormAnalyticsProps {
  analytics: Awaited<ReturnType<typeof GetFormAnalytics>>;
  fieldLabels: Record<string, string>;
  visits: number;
  submissions: number;
  submissionRate: number;
  bounceRate: number;
  t: (key: string) => string;
}

export function FormAnalytics({
  analytics,
  fieldLabels,
  visits,
  submissions,
  submissionRate,
  bounceRate,
  t,
}: FormAnalyticsProps) {
  return (
    <>
      <h2 className="text-muted-foreground my-4 text-2xl font-bold">
        {t('dashboard.analytics')}
      </h2>

      <div className="space-y-6">
        <div className="container mx-auto grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    </>
  );
}
