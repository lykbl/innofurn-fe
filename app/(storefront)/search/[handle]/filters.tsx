import { Accordion } from '@/components/ui/accordion';
import React from 'react';
import { ProductOptionFragmentFragmentDoc } from '@/gql/graphql';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AttributeFilters } from '@/(storefront)/search/[handle]/filters/attributes';
import { OnSaleFilter } from '@/(storefront)/search/[handle]/filters/on-sale';
import { RatingFilter } from '@/(storefront)/search/[handle]/filters/rating';
import { PriceFilter } from '@/(storefront)/search/[handle]/filters/prices';
import { useDebounce } from 'react-use';
import { FragmentType } from '@/gql';

export const Filters = ({
  productOptions,
}: {
  productOptions: Array<FragmentType<typeof ProductOptionFragmentFragmentDoc>>;
}) => {
  return (
    <div className="flex w-1/5 flex-col gap-4 pr-4">
      <Accordion type="multiple">
        <AttributeFilters productOptions={productOptions} />
        <RatingFilter />
        <PriceFilter />
      </Accordion>
      <OnSaleFilter />
    </div>
  );
};

export const useSearchFilterQuery = () => {
  const { replace } = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlSearchParams = new URLSearchParams(searchParams.toString());
  const [newQuery, setNewQuery] = React.useState<string>(
    urlSearchParams.toString(),
  );
  useDebounce(
    () => {
      if (urlSearchParams.toString() !== newQuery) {
        replace(`${pathname}?${newQuery}`, { scroll: false });
      }
    },
    500,
    [newQuery],
  );

  const updateSearchFilter = (urlSearchParams: URLSearchParams) => {
    setNewQuery(urlSearchParams.toString());
  };

  return {
    urlSearchParams,
    updateSearchFilter,
  };
};
