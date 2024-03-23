import { FragmentType, useFragment } from '@/gql/generated';
import { ProductOptionValueFragmentFragmentDoc } from '@/gql/generated/graphql';
import { useSearchFilterQuery } from '@/(storefront)/search/[collectionSlug]/components/filters/filters';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export default function ColorFilterOption({
  valueFragment,
}: {
  valueFragment: FragmentType<typeof ProductOptionValueFragmentFragmentDoc>;
}) {
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
    <TooltipProvider>
      <Tooltip>
        <TooltipContent>{name}</TooltipContent>
        <TooltipTrigger onClick={handleColorClick.bind(null, name)}>
          <span
            style={{ backgroundColor: '#ff0000' }}
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
}
