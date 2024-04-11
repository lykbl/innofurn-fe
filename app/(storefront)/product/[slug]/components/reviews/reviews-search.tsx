import { Card } from '@/components/ui/common/card';
import { Input } from '@/components/ui/common/input';
import { cn } from '@/lib/utils';
import ReviewRow from '@/(storefront)/product/[slug]/components/reviews/review-row';
import { Button } from '@/components/ui/common/button';
import { useDebounce } from 'react-use';
import {
  ChangeEventHandler,
  startTransition,
  TransitionStartFunction,
  useState,
} from 'react';
import { useSuspenseQuery } from '@apollo/client';
import {
  ProductReviewFragmentFragmentDoc,
  SearchProductReviewsOrderBy,
} from '@/gql/generated/graphql';
import { useFragment } from '@/gql/generated';
import { SearchProductReviewsQuery } from '@/gql/queries/product';

export default function ReviewsList({
  slug,
  ratingFilter,
  isLoadingMoreReviews,
  startLoadingMoreReviews,
}: {
  slug: string;
  ratingFilter: null | number;
  isLoadingMoreReviews: boolean;
  startLoadingMoreReviews: TransitionStartFunction;
}) {
  const [search, setSearch] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useDebounce(
    () => {
      startLoadingMoreReviews(() => {
        setSearchQuery(search);
      });
    },
    500,
    [search],
  );

  const {
    data: searchProductReviewsData,
    error,
    fetchMore: fetchMoreReviews,
  } = useSuspenseQuery(SearchProductReviewsQuery, {
    variables: {
      filters: {
        productSlug: slug,
        search: searchQuery,
        rating: ratingFilter,
      },
      page: 1,
      first: 5,
      orderBy: SearchProductReviewsOrderBy.RATING_DESC,
    },
  });
  const productReviews =
    searchProductReviewsData?.searchProductReviews?.data.map((review) =>
      useFragment(ProductReviewFragmentFragmentDoc, review),
    );
  const reviewsPaginatorInfo =
    searchProductReviewsData?.searchProductReviews?.paginatorInfo;
  const handleLoadMoreReviews = () => {
    startTransition(() => {
      fetchMoreReviews({
        variables: {
          filters: {
            productSlug: slug,
            search: searchQuery,
            rating: ratingFilter,
          },
          page: reviewsPaginatorInfo?.currentPage + 1,
          first: 5,
          orderBy: SearchProductReviewsOrderBy.RATING_DESC,
        },
      });
    });
  };
  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className="flex w-4/5 flex-col gap-2 rounded">
      <Card className="space-y-2 bg-secondary p-2">
        <div className="flex flex-col gap-2 border-neutral-200 bg-secondary">
          <h3 className="font-medium">Looking for specific info?</h3>
          <Input
            type="text"
            placeholder="Search in reviews, Q&A..."
            onChange={handleSearchChange}
          />
        </div>
        <div>
          {/*TODO add customers say / keywords search */}
          {/*  <div className="flex flex-col">*/}
          {/*  <h3 className="font-medium">Reviews with images</h3>*/}
          {/*  <div className="py-2">*/}
          {/*    /!* TODO add images to reviews*!/*/}
          {/*    /!*<Carousel items={reviewImages} controlsSize={20} />*!/*/}
          {/*    <Carousel>*/}
          {/*      <CarouselContent>*/}
          {/*        {reviewImages.map((item, index) => (*/}
          {/*          <CarouselItem key={index}>{item}</CarouselItem>*/}
          {/*        ))}*/}
          {/*      </CarouselContent>*/}
          {/*    </Carousel>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </Card>
      <div
        className={cn(
          'flex flex-col gap-2',
          isLoadingMoreReviews && 'animate-pulse',
        )}
      >
        {productReviews.map((review, index) => (
          <ReviewRow key={review.id} review={review} />
        ))}
        <Button
          onClick={handleLoadMoreReviews}
          disabled={isLoadingMoreReviews}
          className={cn(!reviewsPaginatorInfo?.hasMorePages && 'hidden')}
        >
          Load more reviews
        </Button>
      </div>
    </div>
  );
}
