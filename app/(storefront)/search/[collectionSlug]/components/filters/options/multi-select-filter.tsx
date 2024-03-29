import { AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useFragment } from '@/gql/generated';
import {
  ProductOptionFragmentFragment,
  ProductOptionValueFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import MultiSelectFilterOption from '@/(storefront)/search/[collectionSlug]/components/filters/options/multi-select-filter-option';
import { useContext } from 'react';
import { FiltersContext } from '@/(storefront)/search/[collectionSlug]/components/filters/filters.context';

export default function MultiSelectFilter({
  productOption,
}: {
  productOption: ProductOptionFragmentFragment;
}) {
  const { handle, label, values } = productOption;
  const valuesFragments = values.map((value) =>
    useFragment(ProductOptionValueFragmentFragmentDoc, value),
  );
  const { updateOptionFilters } = useContext(FiltersContext);
  const handleCheckboxClick = (value: string) => {
    updateOptionFilters(handle, value);
  };
  const { optimisticFilters } = useContext(FiltersContext);
  const selectedOptions =
    optimisticFilters?.options?.find((option) => option.handle === handle)
      ?.values || [];

  return (
    <AccordionItem value={handle}>
      <AccordionTrigger className="px-1">{label}</AccordionTrigger>
      {valuesFragments.map((valueFragment, index) => (
        <MultiSelectFilterOption
          key={index}
          selectedOptions={selectedOptions}
          valueFragment={valueFragment}
          handleCheckboxClick={handleCheckboxClick}
        />
      ))}
    </AccordionItem>
  );
}
