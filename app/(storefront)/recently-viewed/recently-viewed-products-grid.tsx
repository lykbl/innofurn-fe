'use client';

import { useSuspenseQuery } from '@apollo/client';
import { useFragment } from '@/gql/generated';
import React from 'react';
import { ProductCardFragmentFragmentDoc } from '@/gql/generated/graphql';
import ProductCard from '@/components/product/product-card';

export default function RecentlyViewedProducts() {
  const { data: recentlyViewedProductsQuery } = useSuspenseQuery(
    RecentlyViewedProductsQuery,
  );
  const recentlyViewedProducts =
    recentlyViewedProductsQuery.recentlyViewedProducts.map(
      (recentlyViewedProduct) =>
        useFragment(RecentlyViewedProductFragment, recentlyViewedProduct),
    );

  return (
    <div className="grid grid-cols-5 gap-4">
      {recentlyViewedProducts.map((recentlyViewedProductVariant) => (
        <ProductCard
          key={recentlyViewedProductVariant.id}
          product={useFragment(
            ProductCardFragmentFragmentDoc,
            recentlyViewedProductVariant.product,
          )}
        />
      ))}
    </div>
  );
}
