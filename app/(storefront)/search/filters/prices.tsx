import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/common/input";
import { useState } from "react";
import { useSearchFilterQuery } from "@/(storefront)/search/filters";

export const PriceFilter = () => {
  const { urlSearchParams, updateSearchFilter } = useSearchFilterQuery();
  const [error, setError] = useState<string|null>(null);

  const handleInputChange = (key: string, value: number) => {
    const newValue = Number(value);
    if (key === 'minPrice' && newValue > Number(urlSearchParams.get('maxPrice'))) {
      setError('Min price must be less than max price');
    } else if (key === 'maxPrice' && newValue < Number(urlSearchParams.get('maxPrice'))) {
      setError('Max price must be greater than min price');
    } else {
      value ? urlSearchParams.set(key, value.toFixed(0).toString()) : urlSearchParams.delete(key);
      updateSearchFilter(urlSearchParams);
      setError(null);
    }
  }

  return (
    <AccordionItem value="price">
      <AccordionTrigger>Price</AccordionTrigger>
      <AccordionContent>
        <div className="flex gap-2 text-xs p-2">
          <div className="flex flex-col gap-2">
            <label>
              Min
            </label>
            <Input
              id="min-price"
              type="number"
              className="appearance-none"
              onChange={(e) => handleInputChange('minPrice', Number(e.target.value))}
              value={urlSearchParams.get('minPrice') || ""}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>
              Max
            </label>
            <Input
              id="max-price"
              type="number"
              onChange={(e) => handleInputChange('maxPrice', Number(e.target.value))}
              value={urlSearchParams.get('maxPrice') || ""}
            />
          </div>
        </div>
        {error && <span className="px-2 text-red-500 text-xs">{error}</span>}
      </AccordionContent>
    </AccordionItem>
  );
}
