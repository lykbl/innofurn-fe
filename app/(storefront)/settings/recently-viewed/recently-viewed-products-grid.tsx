'use client';

import { useSuspenseQuery } from '@apollo/client';
import { useFragment } from '@/gql/generated';
import React from 'react';
import {
  ProductCardFragmentFragmentDoc,
  RecentlyViewedProductFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import ProductCard from '@/components/product/product-card';
import { RecentlyViewedProductsQuery } from '@/gql/queries/product';

export default function RecentlyViewedProducts() {
  const { data: recentlyViewedProductsQuery } = useSuspenseQuery(
    RecentlyViewedProductsQuery,{
      fetchPolicy: "no-cache",
    }
  );
  const recentlyViewedProducts =
    recentlyViewedProductsQuery.recentlyViewedProducts.map(
      (recentlyViewedProduct) =>
        useFragment(
          RecentlyViewedProductFragmentFragmentDoc,
          recentlyViewedProduct,
        ),
    );
  if (recentlyViewedProducts.length === 0) {
    return (
      <div className="flex h-80 w-full flex-col items-center justify-center">
        Uh-oh! Looks like there is nothing here.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-4">
      {recentlyViewedProducts.map((recentlyViewedProductVariant) => {
        const product = useFragment(
          ProductCardFragmentFragmentDoc,
          recentlyViewedProductVariant.product,
        );

        return <ProductCard key={product.id} product={product} />;
      })}
    </div>
  );
}
