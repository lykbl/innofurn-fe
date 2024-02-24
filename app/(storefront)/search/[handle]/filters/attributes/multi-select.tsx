import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/common/checkbox';
import { useSearchFilterQuery } from '@/(storefront)/search/[handle]/filters';
import { FragmentType, useFragment } from '@/gql';
import { ProductOptionValueFragmentFragmentDoc } from '@/gql/graphql';

export const MultiSelectFilter = ({
  handle,
  label,
  valuesFragments,
}: {
  handle: string;
  label: string;
  valuesFragments: Array<
    FragmentType<typeof ProductOptionValueFragmentFragmentDoc>
  >;
}) => {
  return (
    <AccordionItem value={handle}>
      <AccordionTrigger className="px-1">{label}</AccordionTrigger>
      {valuesFragments.map((valueFragment, index) => (
        <MultiSelectFilterOption
          index={index}
          valueFragment={valueFragment}
          handle={handle}
        />
      ))}
    </AccordionItem>
  );
};

const MultiSelectFilterOption = ({
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
  const handleCheckboxClick = (value: string) => {
    urlSearchParams.has(handle, value)
      ? urlSearchParams.delete(handle, value)
      : urlSearchParams.append(handle, value);
    updateSearchFilter(urlSearchParams);
  };
  return (
    <AccordionContent key={index} className="flex items-center gap-2 px-1">
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
};
