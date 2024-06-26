import React, { Suspense } from 'react';
import RecentlyViewedProducts from '@/(storefront)/settings/recently-viewed/recently-viewed-products-grid';
import RecentlyViewedProductsGridSkeleton from '@/(storefront)/settings/recently-viewed/recently-viewed-products-grid-skeleton';

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <h1 className="text-2xl">Your recently viewed products</h1>
        <p className="text-xl">Take a second look at what you've been up to!</p>
      </div>
      <Suspense fallback={<RecentlyViewedProductsGridSkeleton />}>
        <RecentlyViewedProducts />
      </Suspense>
    </div>
  );
}
