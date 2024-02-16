"use client";

import React, { Suspense } from "react";
import { useSuspenseQuery } from "@apollo/client";
import { gql } from "@/gql";
import { Filters } from "@/(storefront)/search/[handle]/filters";
import { OrderBySelect } from "@/(storefront)/search/[handle]/order-by";
import { Paginator } from "@/(storefront)/search/[handle]/paginator";
import { ProductsGrid } from "@/(storefront)/search/[handle]/products-grid";

const FILTERS_QUERY = gql(/* GraphQL */`
    query filterableAttributesForCollection($productTypeId: IntID!) {
        filterableAttributesForCollection(productTypeId: $productTypeId) {
            values
            handle
            label
            type
        }
    }
`);

export default function Page({ params: { handle } }) {
  const { data: availableFiltersQuery, error: filtersError } = useSuspenseQuery(FILTERS_QUERY, {
    variables: {
      productTypeId: Number(handle),
    }
  });

  return (
    <div className="flex gap-2 w-full pb-10">
      <Suspense fallback={<div>Loading...</div>}>
        <Filters
          dynamicAttributes={availableFiltersQuery?.filterableAttributesForCollection}
        />
      </Suspense>
      <div className="flex flex-col gap-8 w-4/5 pl-4 border-l">
        <div className="flex justify-between items-end">
          <h1 className="text-3xl">Results for: {"Search query"}</h1>
          <OrderBySelect />
        </div>
        <div className="grid gap-4 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2">
          <Suspense fallback={<div>Loading...</div>}>
            <ProductsGrid />
          </Suspense>
        </div>
        <Paginator />
      </div>
    </div>
  );
}
