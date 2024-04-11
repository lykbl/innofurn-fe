'use client';

import ReviewsBreakdownView from '@/(storefront)/product/[slug]/components/reviews/reviews-breakdown-view';
import { Suspense, useState, useTransition } from 'react';
import { Rating } from '@/gql/scalars';
import ReviewsSearchSkeleton from '@/skeletons/product/reviews-search-skeleton';
import ReviewsBreakdownSkeleton from '@/skeletons/product/reviews-breakdown-skeleton';
import ReviewsList from '@/(storefront)/product/[slug]/components/reviews/reviews-search';

export default function Reviews({ slug }: { slug: string }) {
  const [ratingFilter, setRatingFilter] = useState<Rating | null>(null);
  const [isLoadingMoreReviews, startLoadingMoreReviews] = useTransition();

  return (
    <section className="flex justify-between gap-2">
      <Suspense key={`${slug}ReviewsBreakdown`} fallback={<ReviewsBreakdownSkeleton />}>
        <ReviewsBreakdownView
          slug={slug}
          ratingFilter={ratingFilter}
          setRatingFilter={setRatingFilter}
          startLoadingMoreReviews={startLoadingMoreReviews}
          isLoadingMoreReviews={isLoadingMoreReviews}
        />
      </Suspense>
      <Suspense key={`${slug}ReviewsSearch`} fallback={<ReviewsSearchSkeleton />}>
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
