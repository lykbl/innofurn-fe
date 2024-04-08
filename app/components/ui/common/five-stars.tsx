import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/common/button';
import { cva, type VariantProps } from 'class-variance-authority';

const starIconVariants = cva('', {
  variants: {
    size: {
      default: 'h-5 w-5',
      sm: 'h-4 w-4',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const ratingToEmoji = (rating: number) => {
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

const StarIcon = ({
  rating,
  starWeight,
  className,
}: Pick<FiveStarsProps, 'rating' | 'size'> & {
  starWeight: number;
  className?: string;
}) => {
  const isFilled = rating >= starWeight;
  const withGradient = rating >= starWeight + 0.5 && rating < starWeight + 1;

  return (
    <Icons.star
      className={cn(
        'h-full w-full stroke-primary',
        isFilled ? 'text-primary' : 'text-transparent',
        className,
      )}
      withGradient={withGradient}
    />
  );
};

const StarButton = ({
  className,
  rating,
  starWeight,
  handleClick,
  handleMouseOut,
  handleMouseOver,
  size,
}: Pick<FiveStarsProps, 'rating' | 'size'> & {
  className: string;
  starWeight: number;
  handleMouseOver: (starWeight: number) => void;
  handleMouseOut: () => void;
  handleClick?: (starWeight: number) => void;
}) => {
  if (handleClick) {
    return (
      <Button
        type="button"
        variant="ghost"
        className={cn(
          'h-5 p-0.5 hover:bg-transparent focus-visible:ring-inset',
        )}
        onMouseOver={() => handleMouseOver(starWeight)}
        onMouseOut={handleMouseOut}
        onClick={() => handleClick(starWeight)}
      >
        <StarIcon rating={rating} starWeight={starWeight} />
      </Button>
    );
  }

  return (
    <StarIcon
      rating={rating}
      starWeight={starWeight}
      className={className}
      size={size}
    />
  );
};

type FiveStarsProps = {
  className?: string;
  rating: number;
  reviewsCount?: number;
  handleClick?: (rating: number) => void;
  withEmojis?: boolean;
} & VariantProps<typeof starIconVariants>;

export default function FiveStars({
  className,
  rating,
  reviewsCount,
  handleClick,
  withEmojis,
  size,
}: FiveStarsProps) {
  const [previewRating, setPreviewRating] = useState<number>(rating);
  const handleMouseOver = (rating: number) => setPreviewRating(rating);
  const handleMouseOut = () => setPreviewRating(rating);

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {Array.from({ length: 5 }, (_, index) => (
          <StarButton
            className={cn(starIconVariants({ size, className }))}
            key={index}
            starWeight={index + 1}
            rating={previewRating}
            handleMouseOver={() => handleMouseOver(index + 1)}
            handleMouseOut={handleMouseOut}
            handleClick={handleClick}
          />
        ))}
      </div>
      {reviewsCount && <span className="text-xs">({reviewsCount})</span>}
      {withEmojis && <span>{ratingToEmoji(previewRating)}</span>}
      {/*TODO slot this?*/}
    </div>
  );
}
