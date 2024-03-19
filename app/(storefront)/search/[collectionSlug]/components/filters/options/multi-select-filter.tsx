import { AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FragmentType } from '@/gql/generated';
import { ProductOptionValueFragmentFragmentDoc } from '@/gql/generated/graphql';
import MultiSelectFilterOption from '@/(storefront)/search/[collectionSlug]/components/filters/options/multi-select-filter-option';

export default function MultiSelectFilter({
  handle,
  label,
  valuesFragments,
}: {
  handle: string;
  label: string;
  valuesFragments: Array<
    FragmentType<typeof ProductOptionValueFragmentFragmentDoc>
  >;
}) {
  return (
    <AccordionItem value={handle}>
      <AccordionTrigger className="px-1">{label}</AccordionTrigger>
      {valuesFragments.map((valueFragment, index) => (
        <MultiSelectFilterOption
          key={index}
          index={index}
          valueFragment={valueFragment}
          handle={handle}
        />
      ))}
    </AccordionItem>
  );
}
