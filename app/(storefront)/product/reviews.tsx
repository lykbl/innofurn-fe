'use client';

import { Stars } from '@/(storefront)/product/rating';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import { Button } from '@/components/ui/common/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Input } from '@/components/ui/common/input';
import { calculatePercentage } from '@/lib/utils';

const reviewImages = Array(10)
  .fill(null)
  .map((_, index) => (
    <div key={index} className="min-w-[200px]">
      <Image
        className="rounded"
        width={200}
        height={200}
        alt="Review imaeg"
        src="/sample-kitchen-image-2.jpg"
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
      className={clsx(
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

interface ReviewsBreakdownProps {
  totalCount: number;
}

const ReviewsBreakdown = ({ totalCount }: ReviewsBreakdownProps) => {
  return (
    <div className="flex h-min w-1/5 flex-col rounded bg-secondary p-2">
      <h2>Customer Reviews</h2>
      <div className="flex flex-col gap-2 border-b border-primary py-2">
        <div className="flex gap-2 text-lg">
          <Stars size={24} /> 4.8 of 5
        </div>
        <div className="flex flex-col gap-2">
          {ratings.map((review, index) => (
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
      <div className="flex flex-col gap-2 py-2">
        <h5 className="font-semibold">Review this product</h5>
        <span className="text-sm">
          Share your thoughts with other customers
        </span>
        <Button className="py-1">Leave a review</Button>
      </div>
    </div>
  );
};

interface ReviewsSummaryProps {}

const ReviewSample = () => (
  <div className="mb-4 flex flex-col gap-1 border-b border-black py-2 text-sm font-medium">
    <div className="mb-2 flex items-center gap-1">
      <span className="h-[25px] w-[25px] rounded-full bg-gray-500" />
      <span className="text-md">Dan</span>
    </div>
    <div className="flex items-center gap-1">
      <Stars size={16} />
    </div>
    <p>
      <h4 className="text-lg font-semibold">Nice Travel Size</h4>
    </p>
    <p>
      <span>Color: Blue</span>
      <span className="ml-2 border-l border-black pl-2 text-green-500">
        Verified purchase
      </span>
    </p>
    <p>
      {' '}
      use this as a watercolor paint reference book. Each pocket can hold two
      swatches and keeps my variety of paint information readily at hand. I can
      quickly compare colors, light fastness, pigment numbers as the pockets are
      crystal clear. Nothing falls or slips out of the pockets and the materials
      are sturdier than most photo albums! I'm sure it would be perfect for what
      is was made for, but for me, it is the perfect library of my watercolor
      info.
    </p>
    <p className="flex gap-2 text-gray-500">
      <span>Reviewed in the United States on October 9, 2023</span>
    </p>
    <div className="py-2">
      <Carousel>
        <CarouselContent>
          {Array(10)
            .fill(null)
            .map((_, index) => (
              <CarouselItem>
                <Image
                  key={index}
                  className="min-w-[100px] rounded"
                  width={100}
                  height={100}
                  src="/sample-kitchen-image-2.jpg"
                  alt="customer pohoto"
                />
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>
    </div>
    <div className="mt-2 flex gap-2">
      <Button>Helpful</Button>
      <Button>Report</Button>
    </div>
  </div>
);
const ReviewsSummary = ({}: ReviewsSummaryProps) => {
  return (
    <div className="flex w-3/5 flex-col rounded bg-secondary p-2">
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
            {Array(3)
              .fill(null)
              .map((_, index) => (
                <ReviewSample key={index} />
              ))}
            <Button>Load more reviews</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Reviews = () => {
  const totalCount = 317;

  return (
    <section className="flex flex-col gap-2">
      <div className="flex gap-4">
        <ReviewsBreakdown totalCount={totalCount} />
        <ReviewsSummary />
      </div>
    </section>
  );
};

export default Reviews;
