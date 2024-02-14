"use client";

import React, { Suspense } from "react";
import { useSuspenseQuery } from "@apollo/client";
import { gql } from "@/gql";
import { ProductFilterInput, ProductOrderBy } from "@/gql/graphql";
import { Filters, useSearchFilterQuery } from "@/(storefront)/search/filters";
import { Item } from "@/(storefront)/search/item-card";
import { OrderBySelect } from "@/(storefront)/search/order-by";
import { Paginator } from "@/(storefront)/search/paginator";

const DISCOUNT_FRAGMENT = gql(/* GraphQL */ `
    fragment DiscountFragment on Discount {
        id
        data
        name
        type
    }
`);

const SEARCH_PRODUCTS_QUERY = gql(/* GraphQL */ `
    query FindProducts($filters: ProductFilterInput!, $first: Int!, $page: Int!, $orderBy: ProductOrderBy!) {
        findProducts(filters: $filters, first: $first, page: $page, orderBy: $orderBy) {
            data {
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
            paginatorInfo {
                perPage
                total
            }
        }
    }
`);

const FILTERS_QUERY = gql(/* GraphQL */`
    query filterableAttributesForCollection($productTypeId: IntID!) {
        filterableAttributesForCollection(productTypeId: $productTypeId) {
            values
            handle
            label
            type
        }
    }
`);

const PAGE_SIZE = 20;

//TODO improve
const SUPPORTED_ATTRIBUTE_FILTERS = [
  'color',
  'material',
];

export default function Page() {
  const { urlSearchParams } = useSearchFilterQuery();
  const filterInput = buildFilterInput(urlSearchParams);

  const { data, fetchMore, error } = useSuspenseQuery(SEARCH_PRODUCTS_QUERY, {
    variables: {
      filters: filterInput,
      page: urlSearchParams.get('page') ? Number(urlSearchParams.get('page')) : 1,
      first: PAGE_SIZE,
      orderBy: ProductOrderBy.PRICE_DESC,
    },
  });
  const { data: availableFiltersQuery, error: filtersError } = useSuspenseQuery(FILTERS_QUERY, {
    variables: {
      productTypeId: 6,
    }
  });

  return (
    <div className="flex gap-2 w-full pb-10">
      <Filters
        dynamicAttributes={availableFiltersQuery?.filterableAttributesForCollection}
      />
      <div className="flex flex-col gap-8 w-4/5 pl-4 border-l">
        <div className="flex justify-between items-end">
          <h1 className="text-3xl">Results for: {"Search query"}</h1>
          <OrderBySelect />
        </div>
        <div className="grid gap-4 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2">
          <Suspense fallback={<div>Loading...</div>}>
            {data?.findProducts.data.map((product, index) => (
              <Item
                key={index}
                product={product}
              />
            ))}
          </Suspense>
        </div>
        <Paginator />
      </div>
    </div>
  );
}

const buildFilterInput = (urlSearchParams: URLSearchParams): ProductFilterInput => {
  return {
    name: urlSearchParams.get('name') || null,
    attributes: SUPPORTED_ATTRIBUTE_FILTERS.map((handle) => {
      const values = urlSearchParams.getAll(handle);
      if (values.length === 0) {
        return null;
      }

      return {
        handle,
        values,
      };
    }).filter(Boolean),
    price: {
      min: urlSearchParams.has('minPrice') ? Number(urlSearchParams.get('minPrice')) * 100 : null,
      max: urlSearchParams.has('maxPrice') ? Number(urlSearchParams.get('maxPrice')) * 100 : null,
    },
    rating: {
      avg: urlSearchParams.has('rating') ? Number(urlSearchParams.get('rating')) : null,
    },
    onSale: urlSearchParams.has('onSale'),
  };
}
