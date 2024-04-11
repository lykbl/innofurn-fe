'use client';

import React, { Suspense } from 'react';
import Details from '@/(storefront)/product/[slug]/components/details/details';
import DetailsSkeleton from '@/skeletons/product/details-skeleton';
import AssociatedProducts from '@/(storefront)/product/[slug]/components/associatedProducts/associated-products';
import Reviews from '@/(storefront)/product/[slug]/components/reviews/reviews';
import AssociatedProductsSkeleton from '@/skeletons/product/associated-products-skeleton';

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <Suspense key={`${slug}Details`} fallback={<DetailsSkeleton />}>
        <Details slug={slug} />
      </Suspense>
      <Suspense
        key={`${slug}AssocProducts`}
        fallback={<AssociatedProductsSkeleton />}
      >
        <AssociatedProducts slug={slug} />
      </Suspense>
      <Reviews slug={slug} />
    </div>
  );
}
