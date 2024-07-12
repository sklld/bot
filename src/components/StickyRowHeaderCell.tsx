import { Table } from '@radix-ui/themes';
import { RowHeaderCellProps } from '@radix-ui/themes/dist/cjs/components/table';

export function StickyRowHeaderCell({ style, ...props }: RowHeaderCellProps) {
  return (
    <Table.RowHeaderCell
      style={{
        position: 'sticky',
        left: 0,
        backgroundColor: 'var(--color-panel)',
        ...style,
      }}
      {...props}
    />
  );
}
