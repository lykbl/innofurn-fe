'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@/gql/generated';
import Details from '@/(storefront)/product/[slug]/details';

const BrandFragment = gql(/* GraphQL */ `
  fragment BrandFragment on Brand {
    id
    name
    defaultUrl {
      slug
    }
  }
`);

const PriceFragment = gql(/* GraphQL */ `
  fragment PriceFragment on Price {
    price
  }
`);

const MediaPaginatorFragment = gql(/* GraphQL */ `
  fragment MediaPaginatorFragment on MediaPaginator {
    data {
      id
      name
      originalUrl
    }
    paginatorInfo {
      hasMorePages
      currentPage
    }
  }
`);

const ProductDetailsVariantFragment = gql(/* GraphQL */ `
  fragment ProductDetailsVariantFragment on ProductVariant {
    id
    name
    description
    attributes
    averageRating
    reviewsCount
    sku
    images(page: $page) {
      ...MediaPaginatorFragment
    }
    prices {
      ...PriceFragment
    }
    values {
      id
      name
      option {
        handle
        label
      }
    }
  }
`);

const ProductDetailsFragment = gql(/* GraphQL */ `
  fragment ProductDetailsFragment on Product {
    id
    name
    brand {
      ...BrandFragment
    }
    variants {
      ...ProductDetailsVariantFragment
    }
  }
`);

const PRODUCT_DETAILS_QUERY = gql(/* GraphQL */ `
  query ProductDetails($slug: String!, $page: Int!) {
    productDetails(slug: $slug) {
      ...ProductDetailsFragment
    }
  }
`);

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { data: productDetailsQuery, fetchMore: fetchMoreImages } = useQuery(
    PRODUCT_DETAILS_QUERY,
    {
      variables: { slug, page: 1 },
      nextFetchPolicy: 'cache-only',
    },
  );
  const productDetailsFragment = productDetailsQuery?.productDetails;
  if (!productDetailsFragment) {
    return <>error!</>;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Details
        productDetailsFragment={productDetailsFragment}
        fetchMoreImages={fetchMoreImages}
      />
    </div>
  );
}
