import React from 'react';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

const FiveStars = ({
  averageRating,
  reviewsCount,
}: {
  averageRating: number;
  reviewsCount: number;
}) => {
  return (
    <div className="flex items-center gap-1 py-1">
      <div className="flex">
        {Array.from({ length: 5 })
          .fill(null)
          .map((_, index) => (
            <Star
              key={index}
              isFilled={index + 1 < averageRating}
              withGradient={index + 1 === Math.ceil(averageRating)}
            />
          ))}
      </div>
      <span className="text-xs">({reviewsCount})</span>
    </div>
  );
};

type StarProps = {
  isFilled: boolean;
  withGradient: boolean;
  onMouseOver?: () => void;
  onClick?: () => void;
  className?: string;
};
const Star = ({
  isFilled,
  withGradient,
  onMouseOver,
  onClick,
  className,
}: StarProps) => {
  return (
    <Icons.star
      className={cn(
        'h-[16px] w-[16px] stroke-primary',
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

export default FiveStars;
