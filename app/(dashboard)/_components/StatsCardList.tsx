import { GetFormStats } from '@actions/form';
import { FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { LuView } from 'react-icons/lu';
import { TbArrowBounce } from 'react-icons/tb';
import { StatsCard } from './StatsCard';

interface StatsCardsProps {
  loading: boolean;
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  t: (key: string) => string;
}

export function StatsCardsList({ data, loading, t }: StatsCardsProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatsCard
        title={t('dashboard.totalVisits')}
        icon={<LuView className="text-blue-600" />}
        helperText={t('dashboard.allTimeFormVisits')}
        value={data?.visits?.toLocaleString()}
        loading={loading}
        className="gap-4"
      />

      <StatsCard
        title={t('dashboard.totalSubmissions')}
        icon={<FaWpforms className="text-yellow-600" />}
        helperText={t('dashboard.allTimeFormSubmissions')}
        value={data?.submissions?.toLocaleString()}
        loading={loading}
        className="gap-4"
      />

      <StatsCard
        title={t('dashboard.submissionRate')}
        icon={<HiCursorClick className="text-green-600" />}
        helperText={t('dashboard.visitorsSubmitted')}
        value={data?.submissionRate?.toLocaleString() + '%' || ''}
        loading={loading}
        className="gap-4"
      />

      <StatsCard
        title={t('dashboard.bounceRate')}
        icon={<TbArrowBounce className="text-red-600" />}
        helperText={t('dashboard.visitorsLeft')}
        value={data?.bounceRate?.toLocaleString() + '%' || ''}
        loading={loading}
        className="gap-4"
      />
    </div>
  );
}
