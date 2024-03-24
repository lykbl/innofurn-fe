'use client';

import { Button } from '@/components/ui/common/button';


import { Input } from '@/components/ui/common/input';
import { useSuspenseQuery } from '@apollo/client';
import { gql, useFragment } from '@/gql/generated';
import ReviewRow from '@/(storefront)/product/[slug]/components/reviews/review-row';
import { Card } from '@/components/ui/common/card';
import {
  ProductReviewFragmentFragmentDoc,
  ProductReviewsFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import ReviewsBreakdownView from '@/(storefront)/product/[slug]/components/reviews/reviews-breakdown-view';
import Image from 'next/image';
import LeaveReview from '@/(storefront)/product/[slug]/components/reviews/leave-review-form/leave-review';
import { startTransition, useTransition } from 'react';
import { cn } from '@/lib/utils';

const reviewImages = Array(10)
  .fill(null)
  .map((_, index) => (
    <div key={index} className="min-w-[200px]">
      <Image
        className="rounded"
        width={200}
        height={200}
        alt="Review imaeg"
        src="/fallback-image.jpg"
      />
    </div>
  ));

const ProductReviewFragment = gql(/* GraphQL */ `
  fragment ProductReviewFragment on Review {
    id
    title
    body
    rating
    createdAt
    variant {
      id
      name
    }
    customer {
      fullName
    }
  }
`);

const ProductReviewsFragment = gql(/* GraphQL */ `
  fragment ProductReviewsFragment on Product {
    id
    reviewsCount
    reviewsBreakdown
    averageRating
    variants {
      ...ProductReviewVariantFragment
    }
    reviews(first: 5, page: $reviewsPage) {
      data {
        ...ProductReviewFragment
      }
      paginatorInfo {
        hasMorePages
        currentPage
      }
    }
  }
`);

const ProductReviewVariantFragment = gql(/* GraphQL */ `
  fragment ProductReviewVariantFragment on ProductVariant {
    id
    name
  }
`);

export const ProductReviewsQuery = gql(/* GraphQL */ `
  query ProductReviewsQuery($slug: String!, $reviewsPage: Int!) {
    productReviews(slug: $slug, reviewsPage: $reviewsPage) {
      ...ProductReviewsFragment
    }
  }
`);

export default function Reviews({ slug }: { slug: string }) {
  const {
    data,
    error,
    fetchMore: fetchMoreReviews,
  } = useSuspenseQuery(ProductReviewsQuery, {
    variables: {
      slug,
      reviewsPage: 1,
    },
  });
  const productReviewsDetails = useFragment(
    ProductReviewsFragmentFragmentDoc,
    data?.productReviews,
  );
  const productReviews = productReviewsDetails?.reviews.data.map((review) =>
    useFragment(ProductReviewFragmentFragmentDoc, review),
  );
  const reviewsPaginatorInfo = productReviewsDetails?.reviews.paginatorInfo;
  const productVariants = productReviewsDetails?.variants.map((variant) =>
    useFragment(ProductReviewVariantFragment, variant),
  );
  const [isLoadingMoreReviews, setIsLoadingMoreReviews] = useTransition();

  const handleLoadMoreReviews = () => {
    startTransition(() => {
      fetchMoreReviews({
        variables: {
          slug: slug,
          reviewsPage: reviewsPaginatorInfo?.currentPage + 1,
        },
      });
    });
  };

  return (
    <section className="flex justify-between gap-2">
      <div className="sticky top-2 flex h-max w-1/5 flex-col gap-2 rounded">
        <ReviewsBreakdownView
          totalCount={productReviewsDetails.reviewsCount}
          reviewsBreakdown={productReviewsDetails.reviewsBreakdown}
          averageRating={productReviewsDetails.averageRating}
        />
        <LeaveReview productVariants={productVariants} />
      </div>
      <div className="flex w-4/5 flex-col gap-2 rounded">
        <Card className="space-y-2 bg-secondary p-2">
          <div className="flex flex-col gap-2 border-neutral-200 bg-secondary">
            <h3 className="font-medium">Looking for specific info?</h3>
            <Input type="text" placeholder="Search in reviews, Q&A..." />
          </div>
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
    </section>
  );
}
