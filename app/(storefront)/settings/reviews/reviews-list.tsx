import { useSuspenseQuery } from '@apollo/client';
import { useFragment } from '@/gql/generated';
import { Button } from '@/components/ui/common/button';
import { ReviewFragmentFragmentDoc } from '@/gql/generated/graphql';
import { cn } from '@/lib/utils';
import { useTransition } from 'react';
import { MyReviewsQuery } from '@/gql/queries/review';
import ReviewLine from '@/components/review/review-line';

export default function ReviewsList() {
  const { data: myReviewsQuery, fetchMore: fetchMoreReviews } =
    useSuspenseQuery(MyReviewsQuery, {
      variables: {
        page: 1,
        first: 5,
      },
    });
  const reviews = myReviewsQuery?.myReviews.data.map((order) =>
    useFragment(ReviewFragmentFragmentDoc, order),
  );
  const { hasMorePages: hasMoreReviews, currentPage: currentReviewsPage } =
    myReviewsQuery?.myReviews?.paginatorInfo;
  const [loadingMoreReviews, startLoadingMoreReviews] = useTransition();

  const handleLoadMoreReviews = () => {
    startLoadingMoreReviews(async () => {
      await fetchMoreReviews({
        variables: {
          page: currentReviewsPage + 1,
          first: 5,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }

          return {
            myReviews: {
              ...fetchMoreResult.myReviews,
              data: [...prev.myReviews.data, ...fetchMoreResult.myReviews.data],
            },
          };
        },
      });
    });
  };

  return (
    <ul
      className={cn(
        'flex flex-col gap-2',
        loadingMoreReviews && 'animate-pulse',
      )}
    >
      {reviews.map((review) => (
        <ReviewLine review={review} key={review.id} />
      ))}
      {hasMoreReviews && (
        <Button onClick={handleLoadMoreReviews} disabled={loadingMoreReviews}>
          Load more reviews
        </Button>
      )}
    </ul>
  );
}
