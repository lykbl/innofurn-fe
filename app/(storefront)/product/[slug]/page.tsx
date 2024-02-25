'use client';

import React from 'react';
import ProductDetails from '@/(storefront)/product/product-details';
import MoreFromCreator from '@/(storefront)/product/more-from-creator';
import Reviews from '@/(storefront)/product/reviews';
import { useQuery } from '@apollo/client';
import { gql } from '@/gql';

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

const ProductDetailsVariantFragment = gql(/* GraphQL */ `
  fragment ProductDetailsVariantFragment on ProductVariant {
    name
    description
    attributes
    averageRating
    reviewsCount
    images {
      originalUrl
      name
    }
    prices {
      ...PriceFragment
    }
    values {
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
  query ProductDetails($slug: String!) {
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
  const { data: productDetailsQuery, loading } = useQuery(
    PRODUCT_DETAILS_QUERY,
    {
      variables: { slug },
    },
  );
  const productDetailsFragment = productDetailsQuery?.productDetails;
  if (!productDetailsFragment) {
    return <>error!</>;
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <ProductDetails productDetailsFragment={productDetailsFragment} />
      <MoreFromCreator />
      <Reviews />
    </div>
  );
}
