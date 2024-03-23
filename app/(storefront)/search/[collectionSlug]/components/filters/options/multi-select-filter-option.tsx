import { FragmentType, useFragment } from '@/gql/generated';
import { ProductOptionValueFragmentFragmentDoc } from '@/gql/generated/graphql';
import { useSearchFilterQuery } from '@/(storefront)/search/[collectionSlug]/components/filters/filters';
import { AccordionContent } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/common/checkbox';

export default function MultiSelectFilterOption({
  index,
  handle,
  valueFragment,
}: {
  index: number;
  handle: string;
  valueFragment: FragmentType<typeof ProductOptionValueFragmentFragmentDoc>;
}) {
  const { urlSearchParams, updateSearchFilter } = useSearchFilterQuery();
  const { name } = useFragment(
    ProductOptionValueFragmentFragmentDoc,
    valueFragment,
  );
  const handleCheckboxClick = (value: string) => {
    urlSearchParams.has(handle, value)
      ? urlSearchParams.delete(handle, value)
      : urlSearchParams.append(handle, value);
    updateSearchFilter(urlSearchParams);
  };
  return (
    <AccordionContent key={index} className="flex items-center gap-2 px-1 py-2">
      <Checkbox
        id={name}
        defaultChecked={urlSearchParams.has(handle, name)}
        onClick={handleCheckboxClick.bind(null, name)}
      />
      <label
        htmlFor={name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {name}
      </label>
    </AccordionContent>
  );
}
