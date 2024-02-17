import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import React from 'react';

//TODO add breakdown
type StarProps = {
  isFilled: boolean;
  withGradient: boolean;
  onMouseOver?: () => void;
  onClick?: () => void;
};
export const Star = ({
  isFilled,
  withGradient,
  onMouseOver,
  onClick,
}: StarProps) => {
  return (
    <Icons.star
      className={cn(
        'stroke-primary w-[16px] h-[16px] cursor-pointer',
        isFilled ? 'text-primary' : 'text-white',
      )}
      withGradient={withGradient}
      onMouseOver={onMouseOver}
      onClick={onClick}
    />
  );
};

type FiveStarsProps = {
  filledStars: number;
  onMouseOver: (index: number) => void | null;
  onMouseLeave: () => void | null;
  onClick: (index: number) => void | null;
};
export const FiveStars = ({
  filledStars,
  onMouseOver,
  onMouseLeave,
  onClick,
}: FiveStarsProps) => {
  return (
    <div className="flex items-center gap-1" onMouseLeave={onMouseLeave}>
      {Array.from({ length: 5 })
        .fill(null)
        .map((_, index) => (
          <Star
            key={index}
            isFilled={index < filledStars}
            withGradient={false}
            onMouseOver={() => onMouseOver(index)}
            onClick={() => onClick(index)}
          />
        ))}
    </div>
  );
};
