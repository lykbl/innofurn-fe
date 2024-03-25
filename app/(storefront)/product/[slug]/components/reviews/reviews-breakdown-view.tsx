import { Dispatch, SetStateAction, TransitionStartFunction } from 'react';
import { calculatePercentage, cn } from '@/lib/utils';
import { Card } from '@/components/ui/common/card';
import FiveStars from '@/components/ui/common/five-stars';
import { Button } from '@/components/ui/common/button';
import { Rating, ReviewsBreakdown } from '@/gql/scalars';
import LeaveReview from '@/(storefront)/product/[slug]/components/reviews/leave-review-form/leave-review';
import { useSuspenseQuery } from '@apollo/client';
import { useFragment } from '@/gql/generated';
import { ProductReviewsBreakdownFragmentFragmentDoc } from '@/gql/generated/graphql';
import { ProductReviewsBreakdownQuery } from '@/gql/queries/product';
import RatingBar from '@/(storefront)/product/[slug]/components/reviews/rating-bar';

export default function ReviewsBreakdownView({
  slug,
  ratingFilter,
  setRatingFilter,
  startLoadingMoreReviews,
  isLoadingMoreReviews,
}: {
  slug: string;
  ratingFilter: Rating | null;
  setRatingFilter: Dispatch<SetStateAction<Rating | null>>;
  startLoadingMoreReviews: TransitionStartFunction;
  isLoadingMoreReviews: boolean;
}) {
  const { data: productReviewsBreakdownQuery } = useSuspenseQuery(
    ProductReviewsBreakdownQuery,
    {
      variables: {
        slug,
      },
    },
  );
  const { averageRating, reviewsBreakdown, reviewsCount, variants } =
    useFragment(
      ProductReviewsBreakdownFragmentFragmentDoc,
      productReviewsBreakdownQuery?.productDetails,
    );
  const handleRatingFilterClick = (rating: Rating) => {
    startLoadingMoreReviews(() => {
      setRatingFilter((prev) => (rating === prev ? null : rating));
    });
  };

  return (
    <div className="sticky top-2 flex h-max w-1/5 flex-col gap-2 rounded">
      <Card className="bg-secondary p-2">
        <h2>Customer Reviews</h2>
        <div className="flex flex-col gap-2 border-primary">
          <div className="flex gap-2 text-lg">
            <FiveStars rating={averageRating} />
            <span>{averageRating.toFixed(1)} of 5</span>
          </div>
          <div className="flex flex-col gap-2">
            {reviewsBreakdown.map((review: ReviewsBreakdown) => (
              <Button
                variant="outline"
                className={cn(
                  'group flex w-full border-primary bg-transparent text-black hover:bg-transparent hover:text-primary/90 hover:underline',
                  review.rating === ratingFilter
                    ? 'bg-primary text-white hover:bg-primary/90 hover:text-white/90'
                    : '',
                )}
                disabled={isLoadingMoreReviews}
                onClick={() => handleRatingFilterClick(review.rating)}
                key={review.rating}
              >
                <span className="w-1/5 text-left">{`${review.rating} star`}</span>
                <RatingBar
                  className="h-[24px] w-3/5"
                  fillTo={calculatePercentage(review.count, reviewsCount)}
                  selected={review.rating === ratingFilter}
                />
                <span className="w-1/5 text-right">
                  {calculatePercentage(review.count, reviewsCount)}%
                </span>
              </Button>
            ))}
          </div>
        </div>
      </Card>
      <LeaveReview productVariants={variants} />
    </div>
  );
}
