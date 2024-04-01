'use client';

import { Accordion } from '@/components/ui/accordion';
import React from 'react';
import { ProductOptionFragmentFragmentDoc } from '@/gql/generated/graphql';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { OnSaleFilter } from '@/(storefront)/search/[collectionSlug]/components/filters/on-sale';
import { useDebounce } from 'react-use';
import { useFragment } from '@/gql/generated';
import { Card } from '@/components/ui/common/card';
import { useSuspenseQuery } from '@apollo/client';
import { OptionFiltersForCollectionQuery } from '@/gql/queries/product-variant';
import RatingFilter from '@/(storefront)/search/[collectionSlug]/components/filters/rating';
import { SearchParams } from '@/(storefront)/search/[collectionSlug]/page';
import { FiltersProvider } from '@/(storefront)/search/[collectionSlug]/components/filters/filters.context';
import MultiSelectFilter from '@/(storefront)/search/[collectionSlug]/components/filters/options/multi-select-filter';
import PriceFilter from '@/(storefront)/search/[collectionSlug]/components/filters/prices/price-filter';

export default function CollectionFilters({
  collectionSlug,
  searchParams,
}: {
  collectionSlug: string;
  searchParams: SearchParams;
}) {
  const { data: availableOptionsQuery, error: optionsFilterError } =
    useSuspenseQuery(OptionFiltersForCollectionQuery, {
      variables: {
        slug: collectionSlug,
      },
    });
  const productOptions = availableOptionsQuery?.optionFiltersForCollection.map(
    (option) => useFragment(ProductOptionFragmentFragmentDoc, option),
  );

  if (optionsFilterError) {
    return <div>Sorry! Filters could not be loaded.</div>;
  }

  return (
    <FiltersProvider searchParams={searchParams}>
      <Card className="flex w-1/5 flex-col gap-4 p-4">
        <Accordion type="multiple">
          {productOptions?.map((productOption) => (
            <MultiSelectFilter
              key={productOption.handle}
              productOption={productOption}
            />
          ))}
          <RatingFilter />
          <PriceFilter />
        </Accordion>
        <OnSaleFilter />
      </Card>
    </FiltersProvider>
  );
}

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
