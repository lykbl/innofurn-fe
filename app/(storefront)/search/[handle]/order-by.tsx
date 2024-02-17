import { useSearchFilterQuery } from '@/(storefront)/search/[handle]/filters';
import { ProductOrderBy } from '@/gql/graphql';
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

  const handleOrderByChange = (orderBy: ProductOrderBy) => {
    urlSearchParams.set('orderBy', orderBy);
    updateSearchFilter(urlSearchParams);
  };

  return (
    <Select onValueChange={handleOrderByChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort By" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="avg_review">Average customer review</SelectItem>
        <SelectItem value="price_desc">Price: High to Low</SelectItem>
        <SelectItem value="price_asc">Price: Low to High</SelectItem>
      </SelectContent>
    </Select>
  );
};
