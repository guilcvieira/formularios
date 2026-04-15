'use client';

import { GetFormAnalytics } from '@actions/analytics';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts';
import { FaClock, FaMobileAlt } from 'react-icons/fa';
import { MdErrorOutline, MdTrendingDown } from 'react-icons/md';

type AnalyticsData = Awaited<ReturnType<typeof GetFormAnalytics>>;

interface FieldLabelMap {
  [fieldId: string]: string;
}

export interface AnalyticsLabels {
  avgTimeToComplete: string;
  avgTimeHelper: string;
  basedOnSubmissions: string;
  deviceBreakdown: string;
  deviceHelper: string;
  desktop: string;
  mobile: string;
  tablet: string;
  submissions: string;
  visits: string;
  submissionTimeline: string;
  timelineHelper: string;
  fieldDropOff: string;
  dropOffHelper: string;
  dropOffRate: string;
  fieldErrorRate: string;
  errorRateHelper: string;
  errorRate: string;
  noData: string;
}

interface FormAnalyticsChartsProps {
  data: AnalyticsData;
  fieldLabels: FieldLabelMap;
  labels: AnalyticsLabels;
}

const DEVICE_COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'];

export function FormAnalyticsCharts({
  data,
  fieldLabels,
  labels,
}: FormAnalyticsChartsProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AvgTimeCard
          avgSeconds={data.avgTimeToComplete.avgSeconds}
          sampleSize={data.avgTimeToComplete.sampleSize}
          labels={labels}
        />
        <DeviceBreakdownChart data={data.deviceBreakdown} labels={labels} />
      </div>

      <SubmissionTimeAreaChart data={data.submissionTimeline} labels={labels} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FieldDropOffChart
          data={data.fieldDropOff}
          fieldLabels={fieldLabels}
          labels={labels}
        />
        <FieldErrorRatesChart
          data={data.fieldErrors}
          fieldLabels={fieldLabels}
          labels={labels}
        />
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
}

function AvgTimeCard({
  avgSeconds,
  sampleSize,
  labels,
}: {
  avgSeconds: number;
  sampleSize: number;
  labels: AnalyticsLabels;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium">
            {labels.avgTimeToComplete}
          </CardTitle>
          <CardDescription>{labels.avgTimeHelper}</CardDescription>
        </div>
        <FaClock className="text-muted-foreground h-5 w-5" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {sampleSize > 0 ? formatTime(avgSeconds) : '—'}
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          {labels.basedOnSubmissions.replace('{{count}}', String(sampleSize))}
        </p>
      </CardContent>
    </Card>
  );
}

function DeviceBreakdownChart({
  data,
  labels,
}: {
  data: AnalyticsData['deviceBreakdown'];
  labels: AnalyticsLabels;
}) {
  const chartConfig: ChartConfig = {
    count: { label: labels.submissions },
  };

  const chartData = data.map((d) => ({
    name:
      d.device === 'desktop'
        ? labels.desktop
        : d.device === 'mobile'
          ? labels.mobile
          : labels.tablet,
    value: d.count,
    percentage: d.percentage,
    fill: DEVICE_COLORS[
      data.findIndex((dev) => dev.device === d.device) % DEVICE_COLORS.length
    ],
  }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium">
            {labels.deviceBreakdown}
          </CardTitle>
          <CardDescription>{labels.deviceHelper}</CardDescription>
        </div>
        <FaMobileAlt className="text-muted-foreground h-5 w-5" />
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm">{labels.noData}</p>
        ) : (
          <div className="flex items-center gap-6">
            <ChartContainer config={chartConfig} className="h-37.5 w-37.5">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={60}
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={DEVICE_COLORS[index % DEVICE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
            <div className="flex flex-col gap-2">
              {chartData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-2 text-sm">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{
                      backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length],
                    }}
                  />
                  <span>
                    {d.name}: {d.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SubmissionTimeAreaChart({
  data,
  labels,
}: {
  data: AnalyticsData['submissionTimeline'];
  labels: AnalyticsLabels;
}) {
  const chartConfig: ChartConfig = {
    submissions: {
      label: labels.submissions,
      color: 'var(--chart-1)',
    },
    visits: {
      label: labels.visits,
      color: 'var(--chart-2)',
    },
  };

  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
    submissions: d.submissions,
    visits: d.visits,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">
          {labels.submissionTimeline}
        </CardTitle>
        <CardDescription>{labels.timelineHelper}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.every((d) => d.submissions === 0 && d.visits === 0) ? (
          <p className="text-muted-foreground text-sm">{labels.noData}</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[250px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient
                  id="fillSubmissions"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillVisits" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-2)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={true} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="visits"
                stroke="var(--chart-2)"
                strokeWidth={2}
                fill="url(#fillVisits)"
                dot={false}
                animationEasing="ease-in-out"
              />
              <Area
                type="monotone"
                dataKey="submissions"
                fill="url(#fillSubmissions)"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

function FieldDropOffChart({
  data,
  fieldLabels,
  labels,
}: {
  data: AnalyticsData['fieldDropOff'];
  fieldLabels: FieldLabelMap;
  labels: AnalyticsLabels;
}) {
  const chartConfig: ChartConfig = {
    dropOffRate: {
      label: labels.dropOffRate,
      color: 'var(--chart-3)',
    },
  };

  const chartData = data
    .map((d) => ({
      field: fieldLabels[d.fieldId] || d.fieldId,
      dropOffRate: d.dropOffRate,
    }))
    .sort((a, b) => b.dropOffRate - a.dropOffRate);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium">
            {labels.fieldDropOff}
          </CardTitle>
          <CardDescription>{labels.dropOffHelper}</CardDescription>
        </div>
        <MdTrendingDown className="text-muted-foreground h-5 w-5" />
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm">{labels.noData}</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="field"
                type="category"
                tick={{ fontSize: 12 }}
                width={100}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="dropOffRate"
                fill="var(--color-dropOffRate)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

function FieldErrorRatesChart({
  data,
  fieldLabels,
  labels,
}: {
  data: AnalyticsData['fieldErrors'];
  fieldLabels: FieldLabelMap;
  labels: AnalyticsLabels;
}) {
  const chartConfig: ChartConfig = {
    errorRate: {
      label: labels.errorRate,
      color: 'var(--chart-4)',
    },
  };

  const chartData = data
    .map((d) => ({
      field: fieldLabels[d.fieldId] || d.fieldId,
      errorRate: d.errorRate,
      errorCount: d.errorCount,
    }))
    .sort((a, b) => b.errorRate - a.errorRate);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium">
            {labels.fieldErrorRate}
          </CardTitle>
          <CardDescription>{labels.errorRateHelper}</CardDescription>
        </div>
        <MdErrorOutline className="text-muted-foreground h-5 w-5" />
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-muted-foreground text-sm">{labels.noData}</p>
        ) : (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <BarChart data={chartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
              <YAxis
                dataKey="field"
                type="category"
                tick={{ fontSize: 12 }}
                width={100}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar
                dataKey="errorRate"
                fill="var(--color-errorRate)"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
