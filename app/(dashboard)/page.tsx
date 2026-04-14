import CreateFormBtn from '@/components/CreateFormBtn';
import { Separator } from '@/components/ui/separator';
import { getServerT } from '@/lib/server-i18n';
import { Suspense } from 'react';

import { FormCardList } from './_components/FormCardList';
import { FormCardSkeleton } from './_components/FormCardSkeleton';
import { StatsCardsList } from './_components/StatsCardList';
import { StatsCardsWrapper } from './_components/StatsCardWrapper';

export default async function Home() {
  const t = await getServerT();

  return (
    <div className="container p-4">
      <Suspense fallback={<StatsCardsList loading={true} t={t} />}>
        <StatsCardsWrapper />
      </Suspense>
      <Separator className="my-4" />
      <div className="text-2xl font-bold">{t('dashboard.yourForms')}</div>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CreateFormBtn />
        <Suspense
          fallback={[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <FormCardSkeleton key={i} />
          ))}
        >
          <FormCardList />
        </Suspense>
      </div>
    </div>
  );
}
