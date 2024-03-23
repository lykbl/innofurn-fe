'use client';

import { Stars } from '@/(storefront)/product/[slug]/rating';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/common/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/common/input';
import { calculatePercentage, cn } from '@/lib/utils';
import { useSuspenseQuery } from '@apollo/client';
import { gql, useFragment } from '@/gql/generated';
import { ProductReviewFragmentFragmentDoc, ProductReviewsFragmentFragmentDoc } from '@/gql/generated/graphql';
import ReviewSample from '@/(storefront)/product/[slug]/reviews/review-row';
import ReviewRow from '@/(storefront)/product/[slug]/reviews/review-row';
import { Card } from '@/components/ui/common/card';

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

const ratings = [
  { count: 280, rating: 5 },
  { count: 20, rating: 4 },
  { count: 10, rating: 3 },
  { count: 5, rating: 2 },
  { count: 2, rating: 1 },
];

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

const ReviewsBreakdown = ({
  totalCount,
  reviewsBreakdown,
  averageRating,
}: {
  totalCount: number;
  reviewsBreakdown: ReviewsBreakdown;
  averageRating: number;
}) => {
  return (
    <Card className="bg-secondary p-2">
      <h2>Customer Reviews</h2>
      <div className="flex flex-col gap-2 border-primary">
        <div className="flex gap-2 text-lg">
          <Stars size={24} /> {averageRating.toFixed(1)} of 5
        </div>
        <div className="flex flex-col gap-2">
          {reviewsBreakdown.map((review, index) => (
            <Button
              variant="outline"
              className="group flex w-full border-primary bg-transparent text-black hover:bg-transparent hover:text-primary/90 hover:underline"
              key={index}
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
};

const LeaveReview = () => {
  return (
    <Card className="flex flex-col gap-2 bg-secondary p-2">
      <h5 className="font-semibold">Review this product</h5>
      <span className="text-sm">
          Share your thoughts with other customers
        </span>
      <Button className="py-1">Leave a review</Button>
    </Card>
  );
}

const ProductReviewFragment = gql(/* GraphQL */ `
    fragment ProductReviewFragment on Review {
        id
        title
        body
        rating
        createdAt
        variant {
            id
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
     reviews(first: 5, page: $reviewsPage) {
         data {
             ...ProductReviewFragment
         }
         paginatorInfo {
             hasMorePages
         }
     } 
    }
`);

export const ProductReviewsQuery = gql(/* GraphQL */ `
  query ProductReviewsQuery($slug: String!, $reviewsPage: Int!) {
      productReviews(slug: $slug, reviewsPage: $reviewsPage) {
          ...ProductReviewsFragment
      }
  }
`)

export default function Reviews({
  slug,
}: {
  slug: string;
}) {
  const { data, error } = useSuspenseQuery(ProductReviewsQuery, {
    variables: {
      slug,
      reviewsPage: 1,
    },
  });
  const productReviewsDetails = useFragment(ProductReviewsFragmentFragmentDoc, data?.productReviews);
  const productReviews = productReviewsDetails?.reviews.data.map(review => useFragment(ProductReviewFragmentFragmentDoc, review));

  return (
    <section className="flex justify-between gap-2">
      <div className="flex w-1/5 flex-col rounded gap-2 h-max sticky top-2">
        <ReviewsBreakdown
          totalCount={productReviewsDetails.reviewsCount}
          reviewsBreakdown={productReviewsDetails.reviewsBreakdown}
          averageRating={productReviewsDetails.averageRating}
        />
        <LeaveReview />
      </div>
      <Card className="flex w-4/5 flex-col rounded bg-secondary p-2">
          <div className="flex flex-col gap-2 border-neutral-200">
            <h3 className="font-medium">Looking for specific info?</h3>
            <Input
              type="text"
              // className="rounded border border-solid border-black"
              placeholder="Search in reviews, Q&A..."
            />
          </div>
          {/*<div className='py-2'>*/}
          {/*  <h4>Customers say</h4>*/}
          {/*  <p>Customers like the quality, protection, and storage space of the display album. They mention that it has a*/}
          {/*    sturdy build quality, clear pages, and holds cards well. Some say that the durable design helps protect*/}
          {/*    their collection, and that each pocket can hold two swatches.</p>*/}
          {/*  <span className='text-sm text-gray-500'>AI-generated from the text of customer reviews</span>*/}
          {/*</div>*/}
          <div className="flex flex-col">
            <div className="border-b border-black py-2">
              <h3>Reviews with images</h3>
              <div className="py-2">
                {/*<Carousel items={reviewImages} controlsSize={20} />*/}
                <Carousel>
                  <CarouselContent>
                    {reviewImages.map((item, index) => (
                      <CarouselItem key={index}>{item}</CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            </div>
            <div className="py-2">
              <h3 className="text-2xl">Top Reviews</h3>
              <div className="flex flex-col gap-2">
                {productReviews.map(review => (
                    <ReviewRow
                      key={review.id}
                      review={review}
                    />
                ))}
                <Button>Load more reviews</Button>
              </div>
            </div>
          </div>
        </Card>
    </section>
  );
};
