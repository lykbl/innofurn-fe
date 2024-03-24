import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { calculatePercentage, cn } from '@/lib/utils';
import { Card } from '@/components/ui/common/card';
import FiveStars from '@/components/ui/common/five-stars';
import { Button } from '@/components/ui/common/button';
import { ReviewsBreakdown } from '@/gql/scalars';

const RatingBar = ({
  fillTo,
  className,
}: {
  fillTo: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className={cn(
        'rounded border border-primary bg-gray-100 drop-shadow-lg hover:border-primary/90',
        className,
      )}
    >
      <motion.div
        className="h-full w-0 bg-primary duration-300 group-hover:bg-primary/90"
        animate={isInView ? { width: `${fillTo}%` } : { width: 0 }}
      />
    </div>
  );
};

export default function ReviewsBreakdownView({
  totalCount,
  reviewsBreakdown,
  averageRating,
}: {
  totalCount: number;
  reviewsBreakdown: ReviewsBreakdown;
  averageRating: number;
}) {
  return (
    <Card className="bg-secondary p-2">
      <h2>Customer Reviews</h2>
      <div className="flex flex-col gap-2 border-primary">
        <div className="flex gap-2 text-lg">
          <FiveStars rating={averageRating} />
          <span>{averageRating.toFixed(1)} of 5</span>
        </div>
        <div className="flex flex-col gap-2">
          {reviewsBreakdown.map((review) => (
            <Button
              variant="outline"
              className="group flex w-full border-primary bg-transparent text-black hover:bg-transparent hover:text-primary/90 hover:underline"
              key={review.rating}
            >
              <span className="w-1/5 text-left">{`${review.rating} star`}</span>
              <RatingBar
                className="h-[24px] w-3/5"
                fillTo={calculatePercentage(review.count, totalCount)}
              />
              <span className="w-1/5 text-right">
                {calculatePercentage(review.count, totalCount)}%
              </span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
}
