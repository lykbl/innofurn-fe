import { Checkbox } from '@/components/ui/common/checkbox';
import React, { useContext } from 'react';
import { FiltersContext } from '@/(storefront)/search/[collectionSlug]/components/filters/filters.context';

export const OnSaleFilter = () => {
  const { optimisticFilters, updateStaticFilter } = useContext(FiltersContext);

  const handleCheckedChange = (checked: boolean) => {
    updateStaticFilter('onSaleOnly', checked);
  };

  return (
    <div className="flex items-center space-x-2 px-1">
      <Checkbox
        id="onSale"
        defaultChecked={optimisticFilters.onSaleOnly === true}
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
