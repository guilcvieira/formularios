'use client';

import { useMemo } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, SortableHeader } from '@/components/ui/data-table';
import { formatDistance } from 'date-fns';
import { ElementType } from '@/components/FormElements';

type RowData = Record<string, string | number | boolean> & {
  submittedAt: string;
};

interface ColumnMeta {
  id: string;
  label: string;
  required: boolean;
  type: ElementType;
}

interface SubmissionsDataTableProps {
  columns: ColumnMeta[];
  rows: RowData[];
  labels: {
    search: string;
    noResults: string;
    page: string;
    of: string;
    first: string;
    previous: string;
    next: string;
    last: string;
    submittedAt: string;
  };
}

export function SubmissionsDataTable({
  columns: columnsMeta,
  rows,
  labels,
}: SubmissionsDataTableProps) {
  const columns = useMemo<ColumnDef<RowData>[]>(() => {
    const fieldColumns: ColumnDef<RowData>[] = columnsMeta.map((col) => ({
      accessorKey: col.id,
      header: ({ column }) => (
        <SortableHeader column={column}>
          <span className="text-muted-foreground uppercase">{col.label}</span>
        </SortableHeader>
      ),
      cell: ({ getValue }) => {
        const value = getValue();
        return (
          <span className="pl-3">{value != null ? String(value) : ''}</span>
        );
      },
    }));

    const submittedAtColumn: ColumnDef<RowData> = {
      accessorKey: 'submittedAt',
      header: ({ column }) => (
        <div className="text-right">
          <SortableHeader column={column}>
            <span className="text-muted-foreground uppercase">
              {labels.submittedAt}
            </span>
          </SortableHeader>
        </div>
      ),
      cell: ({ getValue }) => {
        const value = getValue() as string;
        return (
          <div className="text-muted-foreground pr-3 text-right">
            {formatDistance(new Date(value), new Date(), { addSuffix: true })}
          </div>
        );
      },
      sortingFn: 'datetime',
    };

    return [...fieldColumns, submittedAtColumn];
  }, [columnsMeta, labels.submittedAt]);

  const firstFieldId = columnsMeta.length > 0 ? columnsMeta[0].id : undefined;

  return (
    <DataTable
      columns={columns}
      data={rows}
      searchKey={firstFieldId}
      labels={labels}
    />
  );
}
