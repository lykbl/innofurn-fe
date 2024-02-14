import { useSearchFilterQuery } from "@/(storefront)/search/filters";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FiveStars } from "@/components/rating/rating-breakdown";
import { useState } from "react";

const DEFAULT_FILTER = 3;

export const RatingFilter = () => {
  const { urlSearchParams, updateSearchFilter } = useSearchFilterQuery();
  const selectedRatingFilter = Number(urlSearchParams.get('rating')) || DEFAULT_FILTER;
  const [previewRating, setPreviewRating] = useState<number>(selectedRatingFilter);

  const handleStarHover = (index: number) => {
    setPreviewRating(index + 1);
  }

  const resetFilter = () => {
    setPreviewRating(selectedRatingFilter);
  }

  const handleStarClick = (index: number) => {
    urlSearchParams.set('rating', String(index + 1));
    updateSearchFilter(urlSearchParams);
    setPreviewRating(index + 1);
  }

  return (
    <AccordionItem value="rating">
      <AccordionTrigger>Rating</AccordionTrigger>
      <AccordionContent
        className="flex gap-2 text-xs"
      >
        <FiveStars
          filledStars={previewRating}
          onMouseOver={handleStarHover}
          onMouseLeave={resetFilter}
          onClick={handleStarClick}
        />
        {previewRating === 5 ? '' : <span>& Up</span>}
      </AccordionContent>
    </AccordionItem>
  );
}
