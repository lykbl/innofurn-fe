'use client';

import React, { Suspense } from 'react';
import Details from '@/(storefront)/product/[slug]/components/details/details';
import DetailsSkeleton from '@/(storefront)/product/[slug]/skeletons/details-skeleton';
import AssociatedProducts from '@/(storefront)/product/[slug]/components/associatedProducts/associated-products';
import Reviews from '@/(storefront)/product/[slug]/components/reviews/reviews';

export default function Page({
  params: { slug },
}: {
  params: { slug: string };
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Suspense fallback={<DetailsSkeleton />}>
        <Details slug={slug} />
      </Suspense>
      <Suspense fallback={<div>Add skeleton</div>}>
        <AssociatedProducts slug={slug} />
      </Suspense>
      <Reviews slug={slug} />
    </div>
  );
}
