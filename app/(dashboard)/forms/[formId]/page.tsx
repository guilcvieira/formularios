import { FormElementInstance } from '@/components/FormElements';
import FormLinkShare from '@/components/FormLinkShare';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import VisitBtn from '@/components/VisitBtn';
import { getServerT } from '@/lib/server-i18n';
import { GetFormAnalytics } from '@actions/analytics';
import { GetFormById } from '@actions/form';
import { ChartLineIcon, ClipboardListIcon } from 'lucide-react';
import { FormAnalytics } from './_components/FormAnalytics';
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
    <div className="flex w-full flex-col gap-4 pb-8">
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

      <Tabs defaultValue="submissions">
        <TabsList className="container mx-auto w-full bg-transparent">
          <div className="w-full">
            <TabsTrigger
              value="submissions"
              className="text-muted-foreground data-[state=active]:bg-accent rounded-sm transition-all duration-200 data-[state=active]:shadow-sm"
            >
              <ClipboardListIcon />
              {t('dashboard.submissions')}
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-muted-foreground data-[state=active]:bg-accent rounded-sm transition-all duration-200 data-[state=active]:shadow-sm"
            >
              <ChartLineIcon />
              {t('dashboard.analytics')}
            </TabsTrigger>
          </div>
        </TabsList>
        <TabsContent
          value="analytics"
          className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0"
        >
          <div className="container mx-auto w-full px-3">
            <FormAnalytics
              analytics={analytics}
              fieldLabels={fieldLabels}
              visits={visits}
              submissions={submissions}
              submissionRate={submissionRate}
              bounceRate={bounceRate}
              t={t}
            />
          </div>
        </TabsContent>
        <TabsContent
          value="submissions"
          className="data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0"
        >
          <div className="container mx-auto w-full px-3">
            <SubmissionsTable formId={formId} t={t} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FormDetailPage;
