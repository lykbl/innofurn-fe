import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useState } from 'react';
import NumberInput, {
  MAX_PRICE_HANDLE,
  MIN_PRICE_HANDLE,
} from '@/(storefront)/search/[collectionSlug]/components/filters/prices/number-input';

export default function PriceFilter() {
  const [error, setError] = useState<string | null>(null);

  return (
    <AccordionItem value="price">
      <AccordionTrigger className="px-1">Price</AccordionTrigger>
      <AccordionContent>
        <div className="flex gap-2 p-2 text-xs">
          <NumberInput
            handle={MIN_PRICE_HANDLE}
            label="Min price"
            setError={setError}
          />
          <NumberInput
            handle={MAX_PRICE_HANDLE}
            label="Max price"
            setError={setError}
          />
        </div>
        {error && <span className="px-2 text-xs text-red-500">{error}</span>}
      </AccordionContent>
    </AccordionItem>
  );
}
