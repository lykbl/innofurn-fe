import { Checkbox } from "@/components/ui/common/checkbox";
import React from "react";
import { useSearchFilterQuery } from "@/(storefront)/search/filters";

export const OnSaleFilter = () => {
  const { urlSearchParams, updateSearchFilter } = useSearchFilterQuery();

  const handleCheckedChange = (checked: boolean) => {
    urlSearchParams.set('onSale', String(checked));
    updateSearchFilter(urlSearchParams)
  }

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="onSale"
        checked={urlSearchParams.get('onSale') === 'true'}
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
}
