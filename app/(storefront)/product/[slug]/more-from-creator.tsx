'use client';

import Rating, { RATING_STYLES } from '@/(storefront)/product/[slug]/rating';
import { formatToCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/common/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const carouselItems = Array(10)
  .fill(null)
  .map((_, index) => {
    return (
      <div key={index} className="flex w-max flex-col rounded bg-secondary p-2">
        <div className="pointer-events-none">
          <Image
            className="rounded"
            src="/fallback-image.jpg"
            alt="image"
            width={200}
            height={200}
          />
          <h3>Atley Throw Pillow</h3>
          <div className="flex items-center">
            <span className="mr-2 text-lg">{formatToCurrency(3499)}</span>
            <span className="text-sm text-zinc-500 line-through">
              {formatToCurrency(4799)}
            </span>
          </div>
        </div>
        <Rating
          starSize={20}
          totalRating={4.6}
          reviewsCount={299}
          style={RATING_STYLES.WITH_RATING}
        />
        <Button className="w-full">Select Options</Button>
      </div>
    );
  });

const MoreFromCreator = () => {
  return (
    <div className="flex w-full flex-col gap-2 border-y border-black py-2">
      <h2>
        More from
        <Link className="ml-2" href="/brand/test">
          TestBrand
        </Link>
      </h2>
      <Link href="/search?brand=test" className="text-lg">
        See All
      </Link>
      <Carousel>
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index} className="basis-1/7">
              {item}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext />
        <CarouselPrevious />
      </Carousel>
    </div>
  );
};

export default MoreFromCreator;
