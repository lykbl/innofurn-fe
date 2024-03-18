import { useSearchFilterQuery } from '@/(storefront)/search/[collectionSlug]/components/filters/filters';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useState } from 'react';
import { Button } from '@/components/ui/common/button';
import FiveStars from '@/components/ui/common/five-stars';

const DEFAULT_FILTER = 3;

export default function RatingFilter() {
  const { urlSearchParams, updateSearchFilter } = useSearchFilterQuery();
  const selectedRatingFilter =
    Number(urlSearchParams.get('rating')) || DEFAULT_FILTER;
  const [previewRating, setPreviewRating] =
    useState<number>(selectedRatingFilter);

  const handleStarHover = (index: number) => {
    setPreviewRating(index + 1);
  };

  const resetFilter = () => {
    setPreviewRating(selectedRatingFilter);
  };

  const handleStarClick = (index: number) => {
    urlSearchParams.set('rating', String(index + 1));
    updateSearchFilter(urlSearchParams);
    setPreviewRating(index + 1);
  };

  const deleteReviewFilter = () => {
    urlSearchParams.delete('rating');
    updateSearchFilter(urlSearchParams);
    setPreviewRating(DEFAULT_FILTER);
  };

  return (
    <AccordionItem value="rating">
      <AccordionTrigger className="px-1">Rating</AccordionTrigger>
      <AccordionContent className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs">
          <FiveStars averageRating={0} reviewsCount={0} />
          {previewRating === 5 ? '' : <span>& Up</span>}
        </div>
        <Button
          className="text-xs"
          variant="outline"
          onClick={deleteReviewFilter}
        >
          Any rating
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}
