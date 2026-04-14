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
import { Form } from '@/lib/generated/prisma';
import { formatDistance } from 'date-fns';
import Link from 'next/link';

import { BiRightArrowAlt } from 'react-icons/bi';
import { FaEdit, FaWpforms } from 'react-icons/fa';
import { LuView } from 'react-icons/lu';

export function FormCard({
  form,
  t,
}: {
  form: Form;
  t: (key: string) => string;
}) {
  return (
    <Card className="border-border/30 flex h-[190px] w-full flex-col justify-between gap-4 rounded-md border-2 py-4 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate font-bold">{form.name}</span>
          {form.published && <Badge>{t('dashboard.published')}</Badge>}
          {!form.published && (
            <Badge variant="destructive">{t('dashboard.draft')}</Badge>
          )}
        </CardTitle>
        <CardDescription className="text-muted-foreground flex items-center justify-between text-sm">
          <span className="truncate">
            {formatDistance(form.createdAt, new Date(), {
              addSuffix: true,
            })}
          </span>
          {form.published && (
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
        {form.description || t('dashboard.noDescription')}
      </CardContent>
      <CardFooter>
        {form.published && (
          <Button asChild className="mt-2 w-full gap-4 text-base">
            <Link href={`/forms/${form.id}`}>
              {t('dashboard.viewSubmissions')}
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
              {t('dashboard.editForm')}
              <FaEdit />
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
