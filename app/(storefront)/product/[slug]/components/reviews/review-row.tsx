import {
  ProductReviewFragmentFragment,
  ProductReviewVariantFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import FiveStars from '@/components/ui/common/five-stars';
import React, { HTMLAttributes } from 'react';
import { Card } from '@/components/ui/common/card';
import { useFragment } from '@/gql/generated';

const ReviewRow = React.forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { review: ProductReviewFragmentFragment }
>(({ review, ...props }, ref) => {
  const variant = useFragment(
    ProductReviewVariantFragmentFragmentDoc,
    review.variant,
  );

  return (
    <Card
      className="flex flex-col bg-secondary p-2 text-sm font-medium"
      ref={ref}
    >
      <div className="mb-2 flex items-center gap-1">
        <span className="h-[25px] w-[25px] rounded-full bg-gray-500" />
        <span className="text-md">{review.customer.fullName}</span>
      </div>
      <div className="flex items-center gap-1">
        <p className="text">
          <span>{variant.name}</span>
          {/*<span className="ml-2 border-l border-black pl-2 text-green-500">*/}
          {/*  Verified purchase*/}
          {/* TODO add logic */}
          {/*</span>*/}
        </p>
        <FiveStars rating={review.rating} />
      </div>
      <p className="text-lg font-semibold">{review.title}</p>
      <p>{review.body}</p>
      <p className="flex gap-2 text-gray-500">
        <span>
          Reviewed on {new Date(review.createdAt).toISOString().split('T')[0]}
        </span>
      </p>
      <div className="py-2">
        {/*<Carousel>*/}
        {/*  <CarouselContent>*/}
        {/*    {Array(10)*/}
        {/*      .fill(null)*/}
        {/*      .map((_, index) => (*/}
        {/*        <CarouselItem key={index}>*/}
        {/*          <Image*/}
        {/*            key={index}*/}
        {/*            className="min-w-[100px] rounded"*/}
        {/*            width={100}*/}
        {/*            height={100}*/}
        {/*            src="/fallback-image.jpg"*/}
        {/*            alt="customer pohoto"*/}
        {/*          />*/}
        {/*        </CarouselItem>*/}
        {/*      ))}*/}
        {/*  </CarouselContent>*/}
        {/*</Carousel>*/}
      </div>
      {/*<div className="mt-2 flex gap-2">*/}
      {/*  <Button>Helpful</Button>*/}
      {/*  <Button>Report</Button>*/}
      {/* TODO add logic */}
      {/*</div>*/}
    </Card>
  );
});

export default ReviewRow;
