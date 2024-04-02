'use client';

import {
  ProductVariantGridFragmentFragmentDoc,
  ProductVariantOrderBy,
} from '@/gql/generated/graphql';
import React from 'react';
import { useSuspenseQuery } from '@apollo/client';
import { useFragment } from '@/gql/generated';
import CardItem from '@/(storefront)/search/[collectionSlug]/components/card-item/card-item';
import { FindProductVariantsForCollectionQuery } from '@/gql/queries/product-variant';
import { useSearchParams } from 'next/navigation';
import { buildFilterInput } from '@/(storefront)/search/[collectionSlug]/components/filters/filters.context';

const PAGE_SIZE = 20;

export default function ProductsGrid({
  collectionSlug,
}: {
  collectionSlug: string;
}) {
  const urlSearchParams = useSearchParams();
  const filterInput = buildFilterInput(collectionSlug, urlSearchParams);
  const { data, error } = useSuspenseQuery(
    FindProductVariantsForCollectionQuery,
    {
      variables: {
        filters: filterInput,
        page: urlSearchParams.get('page')
          ? Number(urlSearchParams.get('page'))
          : 1,
        first: PAGE_SIZE,
        orderBy:
          (urlSearchParams
            .get('orderBy')
            ?.toUpperCase() as ProductVariantOrderBy) ||
          ProductVariantOrderBy.PRICE_DESC,
      },
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
  );

  if (error) {
    return <div>Uh-oh! Something went wrong.</div>;
  }

  const paginatorInfo = data?.findProductVariantsForCollection.paginatorInfo;
  const gridItems = data?.findProductVariantsForCollection.data.map(
    (productVariantFragment) =>
      useFragment(
        ProductVariantGridFragmentFragmentDoc,
        productVariantFragment,
      ),
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
      {gridItems?.map((productVariant) => (
        //TODO replace with general ProductCard component
        <CardItem key={productVariant.id} productVariant={productVariant} />
      ))}
    </div>
  );
}
