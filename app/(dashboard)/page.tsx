import { GetForms, GetFormStats } from "@actions/form";
import CreateFormBtn from "@/components/CreateFormBtn";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Form } from "@/lib/generated/prisma";
import { formatDistance } from "date-fns";
import Link from "next/link";
import { Suspense } from "react";

import { BiRightArrowAlt } from "react-icons/bi";
import { FaEdit, FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { LuView } from "react-icons/lu";
import { TbArrowBounce } from "react-icons/tb";

export default function Home() {
  return (
    <div className="container p-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-4" />
      <div className="text-2xl font-bold">Your Forms</div>
      <Separator className="my-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
    <div className="w-full pt-8 gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatsCard
        title="Total Visits"
        icon={<LuView className="text-blue-600" />}
        helperText="All time form visits"
        value={data?.visits?.toLocaleString()}
        loading={loading}
        className="shadow shadow-blue-600 gap-4"
      />

      <StatsCard
        title="Total Submissions"
        icon={<FaWpforms className="text-yellow-600" />}
        helperText="All time form submissions"
        value={data?.submissions?.toLocaleString()}
        loading={loading}
        className="shadow shadow-yellow-600 gap-4"
      />

      <StatsCard
        title="Submission rate"
        icon={<HiCursorClick className="text-green-600" />}
        helperText="Visistes that resulted in a submission"
        value={data?.submissionRate?.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow shadow-green-600 gap-4"
      />

      <StatsCard
        title="Bounce rate"
        icon={<TbArrowBounce className="text-red-600" />}
        helperText="Visistes that leave without interaction"
        value={data?.bounceRate?.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow shadow-red-600 gap-4"
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

function StatsCard({
  title,
  icon,
  helperText,
  value = "0",
  loading,
  className,
}: StatsCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-base font-medium text-muted-foreground">
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
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
}

function FormCardSkeleton() {
  return (
    <Skeleton className="border-2 border-border/20 h-[190px] w-full rounded-md" />
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
    <Card className="flex flex-col gap-4 justify-between border-2 border-border/30 h-[190px] w-full rounded-md shadow-none py-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center gap-2">
          <span className="truncate font-bold">{form.name}</span>
          {form.published && <Badge>Published</Badge>}
          {!form.published && <Badge variant="destructive">Draft</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="truncate">
            {formatDistance(form.createdAt, new Date(), {
              addSuffix: true,
            })}
          </span>
          {!form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-blue-600" />
              {form.visits?.toLocaleString() || "0"}
              <FaWpforms className="text-yellow-600" />
              {form.submissions?.toLocaleString() || "0"}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[20px] truncate text-sm text-muted-foreground">
        {form.description || "No description provided"}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className="w-full mt-2 text-base gap-4">
            <Link href={`/forms/${form.id}`}>
              View submissions
              <BiRightArrowAlt />
            </Link>
          </Button>
        )}

        {!form.published && (
          <Button
            asChild
            variant={"secondary"}
            className="w-full mt-2 text-base gap-4"
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
