import { useSearchFilterQuery } from "@/(storefront)/search/[handle]/filters";
import { useSuspenseQuery } from "@apollo/client";
import { ProductFilterInput, ProductOrderBy } from "@/gql/graphql";
import { Item } from "@/(storefront)/search/[handle]/item-card";
import React from "react";
import { FragmentType, gql, useFragment } from "@/gql";

const PAGE_SIZE = 20;

//TODO improve
const SUPPORTED_ATTRIBUTE_FILTERS = ['color', 'material'];

export const DiscountFragment = gql(/* GraphQL */ `
  fragment DiscountFragment on Discount {
    id
    data
    name
    type
  }
`);

export const ProductGridFragment = gql(/* GraphQL */ `
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
      }
    }
  }
`);

export const ProductsGrid = () => {
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

  return data?.findProducts.data.map(
    (product: FragmentType<typeof ProductGridFragment>) => (
      <Item
        key={useFragment(ProductGridFragment, product).id}
        productFragment={product}
      />
    ),
  );
};

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
