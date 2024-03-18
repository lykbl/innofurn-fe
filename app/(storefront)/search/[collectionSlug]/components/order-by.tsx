'use client';

import { useSearchFilterQuery } from '@/(storefront)/search/[collectionSlug]/components/filters/filters';
import { ProductVariantOrderBy } from '@/gql/generated/graphql';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React from 'react';

export const OrderBySelect = () => {
  const { urlSearchParams, updateSearchFilter } = useSearchFilterQuery();

  const handleOrderByChange = (orderBy: ProductVariantOrderBy) => {
    urlSearchParams.set('orderBy', orderBy);
    updateSearchFilter(urlSearchParams);
  };

  return (
    <Select onValueChange={handleOrderByChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ProductVariantOrderBy.RATING_DESC}>
          Rating: High to Low
        </SelectItem>
        <SelectItem value={ProductVariantOrderBy.RATING_ASC}>
          Rating: Low to High
        </SelectItem>
        <SelectItem value={ProductVariantOrderBy.PRICE_DESC}>
          Price: High to Low
        </SelectItem>
        <SelectItem value={ProductVariantOrderBy.PRICE_ASC}>
          Price: Low to High
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
