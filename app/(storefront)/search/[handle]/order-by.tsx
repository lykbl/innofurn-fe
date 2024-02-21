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
        <SelectItem value={ProductOrderBy.AVG_RATING}>Average customer review</SelectItem>
        <SelectItem value={ProductOrderBy.PRICE_DESC}>Price: High to Low</SelectItem>
        <SelectItem value={ProductOrderBy.PRICE_ASC}>Price: Low to High</SelectItem>
      </SelectContent>
    </Select>
  );
};
