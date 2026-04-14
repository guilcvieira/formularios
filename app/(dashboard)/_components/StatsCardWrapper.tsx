import { getServerT } from '@/lib/server-i18n';
import { GetFormStats } from '@actions/form';
import { StatsCardsList } from './StatsCardList';

export async function StatsCardsWrapper() {
  const stats = await GetFormStats();
  const t = await getServerT();

  return <StatsCardsList loading={false} data={stats} t={t} />;
}
