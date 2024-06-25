import { CaretRightIcon } from '@radix-ui/react-icons';
import { Button, Link, TextField } from '@radix-ui/themes';
import { TankDefinition } from '../../../../core/blitzkit/tankDefinitions';
import { useTankopediaFilters } from '../../../../stores/tankopediaFilters';

interface QuickLinkProps {
  topResult?: TankDefinition;
}

export function QuickLink({ topResult }: QuickLinkProps) {
  const search = useTankopediaFilters((state) => state.search);
  const searching = useTankopediaFilters((state) => state.searching);

  if (!search || !topResult || searching) return null;

  return (
    <TextField.Slot>
      <Link href={`/tools/tankopedia/${topResult.id}`}>
        <Button variant="ghost">
          {topResult.name} <CaretRightIcon />
        </Button>
      </Link>
    </TextField.Slot>
  );
}
