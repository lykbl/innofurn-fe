'use client';

import React, { Suspense } from 'react';
import Details from '@/(storefront)/product/[slug]/components/details/details';
import Reviews from '@/(storefront)/product/[slug]/components/reviews/reviews';
import DetailsSkeleton from '@/(storefront)/product/[slug]/skeletons/details-skeleton';

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
      <Reviews slug={slug} />
    </div>
  );
}
