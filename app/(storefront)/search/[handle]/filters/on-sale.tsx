import { Checkbox } from '@/components/ui/common/checkbox';
import React from 'react';
import { useSearchFilterQuery } from '@/(storefront)/search/[handle]/filters';

export const OnSaleFilter = () => {
  const { urlSearchParams, updateSearchFilter } = useSearchFilterQuery();
  const filterKey = 'onSaleOnly'; //TS ?

  const handleCheckedChange = (checked: boolean) => {
    checked
      ? urlSearchParams.set(filterKey, 'true')
      : urlSearchParams.delete(filterKey);
    updateSearchFilter(urlSearchParams);
  };

  return (
    <div className="flex items-center space-x-2 px-1">
      <Checkbox
        id="onSale"
        defaultChecked={urlSearchParams.get(filterKey) === 'true'}
        onCheckedChange={handleCheckedChange}
      />
      <label
        htmlFor="onSale"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        On Sale
      </label>
    </div>
  );
};
