import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/common/button';

const RatingToEmoji = (rating: number) => {
  switch (rating) {
    case 0:
      return '😶';
    case 1:
      return '😠';
    case 2:
      return '😞';
    case 3:
      return '😐';
    case 4:
      return '😊';
    case 5:
      return '😍';
    default:
      return '😐';
  }
};

const Star = ({
  rating,
  starWeight,
  onMouseOver,
  onClick,
  className,
}: {
  rating: number;
  starWeight: number;
  onMouseOver?: () => void;
  onClick?: () => void;
  className?: string;
}) => {
  const isFilled = rating >= starWeight;
  const withGradient = rating >= starWeight + 0.5 && rating < starWeight + 1;

  return (
    <Icons.star
      className={cn(
        'h-full w-full stroke-primary',
        isFilled ? 'text-primary' : 'text-white',
        className,
        onClick && 'cursor-pointer',
      )}
      withGradient={withGradient}
      onMouseOver={onMouseOver}
      onClick={onClick}
    />
  );
};
export default function FiveStars({
  className,
  rating,
  reviewsCount,
  onClick,
  withEmojis,
}: {
  className?: string;
  rating: number;
  reviewsCount?: number;
  onClick?: (rating: number) => void;
  withEmojis?: boolean;
}) {
  const [previewRating, setPreviewRating] = useState<number>(rating);
  const handleMouseOver = (rating: number) => setPreviewRating(rating);
  const handleMouseOut = () => setPreviewRating(rating);
  const handleClick = (rating: number) => {
    onClick && onClick(rating);
  };

  return (
    <div className={cn(className, 'flex items-center gap-1')}>
      <div className="flex">
        {Array.from({ length: 5 })
          .fill(null)
          .map((_, index) => (
            <Button
              type="button"
              key={index}
              variant="ghost"
              className={cn(
                'h-5 p-0.5 hover:bg-transparent focus-visible:ring-inset',
                !onClick && 'pointer-events-none',
              )}
              tabIndex={!onClick ? -1 : undefined}
              onMouseOver={() => handleMouseOver(index + 1)}
              onMouseOut={handleMouseOut}
              onClick={() => handleClick(index + 1)}
            >
              <Star starWeight={index + 1} rating={previewRating} />
            </Button>
          ))}
      </div>
      {reviewsCount && <span className="text-xs">({reviewsCount})</span>}
      {withEmojis && <span>{RatingToEmoji(previewRating)}</span>}
      {/*TODO slot this?*/}
    </div>
  );
}
