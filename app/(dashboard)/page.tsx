import { GetForms, GetFormStats } from '@actions/form';
import CreateFormBtn from '@/components/CreateFormBtn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Form } from '@/lib/generated/prisma';
import { formatDistance } from 'date-fns';
import Link from 'next/link';
import { Suspense } from 'react';

import { BiRightArrowAlt } from 'react-icons/bi';
import { FaEdit, FaWpforms } from 'react-icons/fa';
import { HiCursorClick } from 'react-icons/hi';
import { LuView } from 'react-icons/lu';
import { TbArrowBounce } from 'react-icons/tb';

export default function Home() {
  return (
    <div className="container p-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-4" />
      <div className="text-2xl font-bold">Your Forms</div>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <CreateFormBtn />
        <Suspense
          fallback={[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <FormCardSkeleton key={i} />
          ))}
        >
          <FormCards />
        </Suspense>
      </div>
    </div>
  );
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats} />;
}

interface StatsCardsProps {
  loading: boolean;
  data?: Awaited<ReturnType<typeof GetFormStats>>;
}

function StatsCards({ data, loading }: StatsCardsProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 pt-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatsCard
        title="Total Visits"
        icon={<LuView className="text-blue-600" />}
        helperText="All time form visits"
        value={data?.visits?.toLocaleString()}
        loading={loading}
        className="gap-4 shadow shadow-blue-600"
      />

      <StatsCard
        title="Total Submissions"
        icon={<FaWpforms className="text-yellow-600" />}
        helperText="All time form submissions"
        value={data?.submissions?.toLocaleString()}
        loading={loading}
        className="gap-4 shadow shadow-yellow-600"
      />

      <StatsCard
        title="Submission rate"
        icon={<HiCursorClick className="text-green-600" />}
        helperText="Visistes that resulted in a submission"
        value={data?.submissionRate?.toLocaleString() + '%' || ''}
        loading={loading}
        className="gap-4 shadow shadow-green-600"
      />

      <StatsCard
        title="Bounce rate"
        icon={<TbArrowBounce className="text-red-600" />}
        helperText="Visistes that leave without interaction"
        value={data?.bounceRate?.toLocaleString() + '%' || ''}
        loading={loading}
        className="gap-4 shadow shadow-red-600"
      />
    </div>
  );
}

interface StatsCardProps {
  title: string;
  icon: React.ReactNode;
  helperText: string;
  value?: string;
  loading?: boolean;
  className?: string;
}

export function StatsCard({
  title,
  icon,
  helperText,
  value = '0',
  loading,
  className,
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-muted-foreground text-base font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}

          {!loading && value}
        </div>
        <p className="text-muted-foreground pt-1 text-xs">{helperText}</p>
      </CardContent>
    </Card>
  );
}

function FormCardSkeleton() {
  return (
    <Skeleton className="border-border/20 h-[190px] w-full rounded-md border-2" />
  );
}

async function FormCards() {
  const forms = await GetForms();
  return (
    <>
      {forms.map((form) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  );
}

function FormCard({ form }: { form: Form }) {
  return (
    <Card className="border-border/30 flex h-[190px] w-full flex-col justify-between gap-4 rounded-md border-2 py-4 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate font-bold">{form.name}</span>
          {form.published && <Badge>Published</Badge>}
          {!form.published && <Badge variant="destructive">Draft</Badge>}
        </CardTitle>
        <CardDescription className="text-muted-foreground flex items-center justify-between text-sm">
          <span className="truncate">
            {formatDistance(form.createdAt, new Date(), {
              addSuffix: true,
            })}
          </span>
          {!form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-blue-600" />
              {form.visits?.toLocaleString() || '0'}
              <FaWpforms className="text-yellow-600" />
              {form.submissions?.toLocaleString() || '0'}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground h-[20px] truncate text-sm">
        {form.description || 'No description provided'}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className="mt-2 w-full gap-4 text-base">
            <Link href={`/forms/${form.id}`}>
              View submissions
              <BiRightArrowAlt />
            </Link>
          </Button>
        )}

        {!form.published && (
          <Button
            asChild
            variant={'secondary'}
            className="mt-2 w-full gap-4 text-base"
          >
            <Link href={`/builder/${form.id}`}>
              Edit Form
              <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
