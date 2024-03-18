'use client';

import { Accordion } from '@/components/ui/accordion';
import React from 'react';
import { ProductOptionFragmentFragmentDoc } from '@/gql/generated/graphql';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AttributeFilters } from '@/(storefront)/search/[collectionSlug]/components/filters/options';
import { OnSaleFilter } from '@/(storefront)/search/[collectionSlug]/components/filters/on-sale';
import { RatingFilter } from '@/(storefront)/search/[collectionSlug]/components/filters/rating';
import { PriceFilter } from '@/(storefront)/search/[collectionSlug]/components/filters/prices';
import { useDebounce } from 'react-use';
import { useFragment } from '@/gql/generated';
import { Card } from '@/components/ui/common/card';
import { useSuspenseQuery } from '@apollo/client';
import { FiltersQuery } from '@/gql/queries/product';

export default function CollectionFilters({
  collectionSlug,
}: {
  collectionSlug: string;
}) {
  const { data: availableOptionsQuery, error: optionsFilterError } =
    useSuspenseQuery(FiltersQuery, {
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
    <Card className="flex w-1/5 flex-col gap-4 p-4">
      <Accordion type="multiple">
        <AttributeFilters productOptions={productOptions} />
        <RatingFilter />
        <PriceFilter />
      </Accordion>
      <OnSaleFilter />
    </Card>
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
