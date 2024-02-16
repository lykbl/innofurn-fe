import { useSearchFilterQuery } from "@/(storefront)/search/[handle]/filters";
import { useSuspenseQuery } from "@apollo/client";
import { ProductFilterInput, ProductOrderBy } from "@/gql/graphql";
import { Item } from "@/(storefront)/search/[handle]/item-card";
import React from "react";
import { gql } from "@/gql";

const PAGE_SIZE = 20;

//TODO improve
const SUPPORTED_ATTRIBUTE_FILTERS = [
  'color',
  'material',
];

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

export const ProductsGrid = () => {
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

  return (
    data?.findProducts.data.map((product, index) => (
      <Item
        key={index}
        product={product}
      />
    ))
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
