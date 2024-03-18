'use client';

import {
  ProductFilterInput,
  ProductVariantGridFragmentFragmentDoc,
  ProductVariantOrderBy,
} from '@/gql/generated/graphql';
import React from 'react';
import { useSuspenseQuery } from '@apollo/client';
import { useSearchFilterQuery } from '@/(storefront)/search/[collectionSlug]/components/filters/filters';
import { SearchProductsQuery } from '@/gql/queries/product';
import { useFragment } from '@/gql/generated';
import CardItem from '@/(storefront)/search/[collectionSlug]/components/card-item/card-item';

const PAGE_SIZE = 20;

//TODO improve
const SUPPORTED_ATTRIBUTE_FILTERS = ['color', 'material'];

export default function ProductsGrid({
  collectionSlug,
}: {
  collectionSlug: string;
}) {
  const { urlSearchParams } = useSearchFilterQuery();
  const filterInput = buildFilterInput(collectionSlug, urlSearchParams);
  const { data, error } = useSuspenseQuery(SearchProductsQuery, {
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
  });
  const paginatorInfo = data?.findProductVariants.paginatorInfo;
  const gridItems = data?.findProductVariants.data.map(
    (productVariantFragment) =>
      useFragment(
        ProductVariantGridFragmentFragmentDoc,
        productVariantFragment,
      ),
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
      {gridItems.map((productVariant) => (
        <CardItem key={productVariant.id} productVariant={productVariant} />
      ))}
    </div>
  );
}

const buildFilterInput = (
  collectionSlug: string,
  urlSearchParams: URLSearchParams,
): ProductFilterInput => {
  return {
    search: urlSearchParams.get('search') ?? '',
    collection: collectionSlug,
    options: SUPPORTED_ATTRIBUTE_FILTERS.map((handle) => {
      return {
        handle,
        values: urlSearchParams.getAll(handle),
      };
    }).filter(Boolean),
    price: {
      min: urlSearchParams.has('minPrice')
        ? Number(urlSearchParams.get('minPrice')) * 100
        : null,
      max: urlSearchParams.has('maxPrice')
        ? Number(urlSearchParams.get('maxPrice')) * 100
        : null,
    },
    rating: urlSearchParams.has('rating')
      ? Number(urlSearchParams.get('rating'))
      : null,
    onSaleOnly: urlSearchParams.has('onSaleOnly'),
  };
};
