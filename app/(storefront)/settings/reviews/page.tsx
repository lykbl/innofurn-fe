'use client';

import { Separator } from '@/components/ui/common/separator';
import { Suspense } from 'react';
import OrdersList from '@/(storefront)/settings/orders/orders-list';
import ReviewsList from '@/(storefront)/settings/reviews/reviews-list';
import ReviewsListSkeleton from '@/skeletons/review/reviews-list-skeleton';

export default function Page() {
  return (
    <div className="flex w-2/3 flex-col gap-4">
      <h2>Your product reviews</h2>
      <Separator />
      <Suspense fallback={<ReviewsListSkeleton />}>
        <ReviewsList />
      </Suspense>
    </div>
  );
}
