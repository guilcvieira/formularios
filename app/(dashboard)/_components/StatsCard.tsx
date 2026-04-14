import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

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
