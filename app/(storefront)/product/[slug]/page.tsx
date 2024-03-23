'use client';

import React, { Suspense } from 'react';
import { useQuery } from '@apollo/client';
import Details from '@/(storefront)/product/[slug]/details/details';
import { ProductDetailsQuery } from '@/gql/queries/product';
import Reviews from '@/(storefront)/product/[slug]/reviews/reviews';

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { data: productDetailsQuery, fetchMore: fetchMoreImages } = useQuery(
    ProductDetailsQuery,
    {
      variables: { slug,
        imagesPage: 1
      },
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
      <Suspense fallback='ladoing'>
        <Reviews slug={slug} />
      </Suspense>
    </div>
  );
}
