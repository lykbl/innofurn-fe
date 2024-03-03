'use client';

import React from 'react';
import { useQuery } from '@apollo/client';
import Details from '@/(storefront)/product/[slug]/details';
import { ProductDetailsQuery } from '@/gql/queries/product';

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { data: productDetailsQuery, fetchMore: fetchMoreImages } = useQuery(
    ProductDetailsQuery,
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
