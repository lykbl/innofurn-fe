import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSearchFilterQuery } from '@/(storefront)/search/[handle]/filters';
import { cn } from '@/lib/utils';
import { FragmentType, useFragment } from '@/gql';
import { ProductOptionValueFragmentFragmentDoc } from '@/gql/graphql';

export const ColorFilter = ({
  handle,
  label,
  values,
}: {
  handle: string;
  label: string;
  values: Array<FragmentType<typeof ProductOptionValueFragmentFragmentDoc>>;
}) => {
  return (
    <AccordionItem value={handle}>
      <AccordionTrigger className="px-1">{label}</AccordionTrigger>
      <AccordionContent className="flex gap-2 px-1 pt-2">
        {values.map((valueFragment, index) => (
          <ColorFilterOption
            index={index}
            handle={handle}
            valueFragment={valueFragment}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

const labelToColor = (label: string) => {
  if (label === 'White') return '#ffffff';
  if (label === 'Black') return '#000000';
  if (label === 'Mahogany') return '#c04000';

  return '#ffffff';
};
const ColorFilterOption = ({
  index,
  handle,
  valueFragment,
}: {
  index: number;
  handle: string;
  valueFragment: FragmentType<typeof ProductOptionValueFragmentFragmentDoc>;
}) => {
  const { urlSearchParams, updateSearchFilter } = useSearchFilterQuery();
  const { name } = useFragment(
    ProductOptionValueFragmentFragmentDoc,
    valueFragment,
  );

  const handleColorClick = (value: string) => {
    urlSearchParams.has('color', value)
      ? urlSearchParams.delete('color', value)
      : urlSearchParams.append('color', value);
    updateSearchFilter(urlSearchParams);
  };

  return (
    <TooltipProvider key={index}>
      <Tooltip>
        <TooltipContent>{name}</TooltipContent>
        <TooltipTrigger onClick={handleColorClick.bind(null, name)}>
          <span
            style={{ backgroundColor: labelToColor(name) }}
            className={cn(
              'block h-6 w-6 rounded-full border border-solid border-black',
              urlSearchParams.has('color', name) &&
                'outline outline-1 outline-offset-2 outline-black',
            )}
          />
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
};
