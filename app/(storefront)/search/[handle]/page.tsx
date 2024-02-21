'use client';

import React, { Suspense } from 'react';
import { useSuspenseQuery } from '@apollo/client';
import { gql } from '@/gql';
import { Filters, useSearchFilterQuery } from "@/(storefront)/search/[handle]/filters";
import { OrderBySelect } from '@/(storefront)/search/[handle]/order-by';
import { Paginator } from '@/(storefront)/search/[handle]/paginator';
import { ProductsGrid } from '@/(storefront)/search/[handle]/products-grid';
import { ProductFilterInput, ProductOrderBy } from "@/gql/graphql";

const FILTERS_QUERY = gql(/* GraphQL */ `
  query filterableAttributesForCollection($productTypeId: IntID!) {
    filterableAttributesForCollection(productTypeId: $productTypeId) {
      values
      handle
      label
      type
    }
  }
`);

const DiscountFragment = gql(/* GraphQL */ `
    fragment DiscountFragment on Discount {
        id
        data
        name
        type
    }
`);

const ProductGridFragment = gql(/* GraphQL */ `
    fragment ProductGridFragment on Product {
        id
        name
        discounts {
            ...DiscountFragment
        }
        variants {
            id
            name
            attributes
            images {
                name
                originalUrl
            }
            isFeatured
            isFavorite
            prices {
                id
                price
            }
            averageRating
            reviewsCount
            discounts {
                ...DiscountFragment
            }
        }
    }
`);

const SearchProductsQuery = gql(/* GraphQL */ `
    query FindProducts(
        $filters: ProductFilterInput!
        $first: Int!
        $page: Int!
        $orderBy: ProductOrderBy!
    ) {
        findProducts(
            filters: $filters
            first: $first
            page: $page
            orderBy: $orderBy
        ) {
            data {
                ...ProductGridFragment
            }
            paginatorInfo {
                perPage
                total
                lastPage
                hasMorePages
                currentPage
            }
        }
    }
`);

const PAGE_SIZE = 20;

//TODO improve
const SUPPORTED_ATTRIBUTE_FILTERS = ['color', 'material'];

export default function Page({
  params: { handle },
}: {
  params: { handle: string };
}) {
  const { data: availableFiltersQuery, error: filtersError } = useSuspenseQuery(
    FILTERS_QUERY,
    {
      variables: {
        productTypeId: Number(handle),
      },
    },
  );
  const { urlSearchParams } = useSearchFilterQuery();
  const filterInput = buildFilterInput(urlSearchParams);
  const { data, error } = useSuspenseQuery(SearchProductsQuery, {
    variables: {
      filters: filterInput,
      page: urlSearchParams.get('page')
        ? Number(urlSearchParams.get('page'))
        : 1,
      first: PAGE_SIZE,
      orderBy: urlSearchParams.get('orderBy')?.toUpperCase() as ProductOrderBy || ProductOrderBy.PRICE_DESC,
    },
    fetchPolicy: 'no-cache',
  });
  const paginatorInfo = data?.findProducts.paginatorInfo;

  return (
    <div className="flex gap-2 w-full pb-10">
      <Suspense fallback={<div>Loading...</div>}>
        <Filters
          dynamicAttributes={
            availableFiltersQuery?.filterableAttributesForCollection
          }
        />
      </Suspense>
      <div className="flex flex-col gap-8 w-4/5 pl-4 border-l">
        <div className="flex justify-between items-end">
          <h1 className="text-3xl">Results for: {'Search query'}</h1>
          <OrderBySelect />
        </div>
        <div className="grid gap-4 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2">
          <Suspense fallback={<div>Loading...</div>}>
            <ProductsGrid data={data} error={error} />
          </Suspense>
        </div>
        <Paginator paginatorInfo={paginatorInfo} />
      </div>
    </div>
  );
}

const buildFilterInput = (
  urlSearchParams: URLSearchParams,
): ProductFilterInput => {
  return {
    name: urlSearchParams.get('name') || null,
    attributes: SUPPORTED_ATTRIBUTE_FILTERS.map((handle) => {
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
    rating: {
      avg: urlSearchParams.has('rating')
        ? Number(urlSearchParams.get('rating'))
        : null,
    },
    onSaleOnly: urlSearchParams.has('onSaleOnly'),
  };
};
