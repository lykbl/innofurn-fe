import React from 'react';
import { OrderBySelect } from '@/(storefront)/search/[collectionSlug]/components/order-by';
import { Card } from '@/components/ui/common/card';
import dynamic from 'next/dynamic';
import ProductsGridSkeleton from '@/(storefront)/search/[collectionSlug]/skeletons/products-grid-skeleton';
import FiltersSkeleton from '@/(storefront)/search/[collectionSlug]/skeletons/filters-skeleton';

const DynamicGrid = dynamic(
  () =>
    import('@/(storefront)/search/[collectionSlug]/components/products-grid'),
  {
    ssr: false,
    loading: () => <ProductsGridSkeleton />,
  },
);

const DynamicFilters = dynamic(
  () =>
    import('@/(storefront)/search/[collectionSlug]/components/filters/filters'),
  {
    ssr: false,
    loading: () => <FiltersSkeleton />,
  },
);

export type SearchParams = {
  [key: string]: string | Array<string> | undefined;
};

export default async function Page({
  params: { collectionSlug },
  searchParams,
}: {
  params: { collectionSlug: string };
  searchParams: SearchParams;
}) {
  return (
    <div className="flex w-full gap-4 pb-10">
      <DynamicFilters
        collectionSlug={collectionSlug}
        searchParams={searchParams}
      />
      <Card className="flex w-4/5 flex-col gap-8 border-l p-4">
        <div className="flex items-end justify-between">
          <h1 className="text-3xl">Results for: {'Search query'}</h1>
          <OrderBySelect />
        </div>
        <DynamicGrid collectionSlug={collectionSlug} />
      </Card>
    </div>
  );
}
