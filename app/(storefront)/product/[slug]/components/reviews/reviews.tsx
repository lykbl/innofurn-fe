'use client';

import ReviewsBreakdownView from '@/(storefront)/product/[slug]/components/reviews/reviews-breakdown-view';
import { Suspense, useState, useTransition } from 'react';
import { Rating } from '@/gql/scalars';
import ReviewsSearchSkeleton from '@/(storefront)/product/[slug]/skeletons/reviews-search-skeleton';
import ReviewsBreakdownSkeleton from '@/(storefront)/product/[slug]/skeletons/reviews-breakdown-skeleton';
import ReviewsList from '@/(storefront)/product/[slug]/components/reviews/reviews-search';

export default function Reviews({ slug }: { slug: string }) {
  const [ratingFilter, setRatingFilter] = useState<Rating | null>(null);
  const [isLoadingMoreReviews, startLoadingMoreReviews] = useTransition();

  return (
    <section className="flex justify-between gap-2">
      <Suspense fallback={<ReviewsBreakdownSkeleton />}>
        <ReviewsBreakdownView
          slug={slug}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          startLoadingMoreReviews={startLoadingMoreReviews}
          isLoadingMoreReviews={isLoadingMoreReviews}
        />
      </Suspense>
      <Suspense fallback={<ReviewsSearchSkeleton />}>
        <ReviewsList
          slug={slug}
          ratingFilter={ratingFilter}
          isLoadingMoreReviews={isLoadingMoreReviews}
          startLoadingMoreReviews={startLoadingMoreReviews}
        />
      </Suspense>
    </section>
  );
}
