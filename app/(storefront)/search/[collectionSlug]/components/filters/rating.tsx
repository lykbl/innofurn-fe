import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useContext } from 'react';
import { Button } from '@/components/ui/common/button';
import FiveStars from '@/components/ui/common/five-stars';
import { FiltersContext } from '@/(storefront)/search/[collectionSlug]/components/filters/filters.context';
import { Icons } from '@/components/icons';

const DEFAULT_FILTER = 3;

export default function RatingFilter() {
  const { optimisticFilters, updateStaticFilter } = useContext(FiltersContext);
  const selectedRatingFilter = optimisticFilters.rating;

  const updateRatingFilter = (rating: number | null) => {
    updateStaticFilter('rating', rating);
  };

  return (
    <AccordionItem value="rating">
      <AccordionTrigger className="px-1">Rating</AccordionTrigger>
      <AccordionContent className="flex justify-between gap-2">
        <div className="flex h-6 items-center gap-1 text-xs">
          <FiveStars
            key={selectedRatingFilter}
            rating={selectedRatingFilter || DEFAULT_FILTER}
            onClick={updateRatingFilter}
          />
          {selectedRatingFilter === 5 ? '' : <span>& Up</span>}
        </div>
        {selectedRatingFilter && (
          <Button variant="outline" className="h-6 p-1">
            <Icons.x
              width={16}
              height={16}
              onClick={() => updateRatingFilter(null)}
            />
          </Button>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
