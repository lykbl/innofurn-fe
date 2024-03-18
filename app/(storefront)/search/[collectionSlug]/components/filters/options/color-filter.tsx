import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';


import { FragmentType } from '@/gql/generated';
import { ProductOptionValueFragmentFragmentDoc } from '@/gql/generated/graphql';
import ColorFilterOption from '@/(storefront)/search/[collectionSlug]/components/filters/options/color-filter-option';

export default function ColorFilter({
  handle,
  label,
  values,
}: {
  handle: string;
  label: string;
  values: Array<FragmentType<typeof ProductOptionValueFragmentFragmentDoc>>;
}) {
  return (
    <AccordionItem value={handle}>
      <AccordionTrigger className="px-1">{label}</AccordionTrigger>
      <AccordionContent className="flex gap-2 px-1 pt-2">
        {values.map((valueFragment) => (
          <ColorFilterOption key={handle} valueFragment={valueFragment} />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}
