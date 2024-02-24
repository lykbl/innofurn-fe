'use client';

import Rating, { RATING_STYLES } from '@/(storefront)/product/rating';
import { Button, BUTTON_STYLES } from '@/components/ui/common/button';
import { formatCurrency } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

const carouselItems = Array(10)
  .fill(null)
  .map((el, index) => {
    return (
      <div
        key={index}
        className="flex w-max flex-col gap-1 rounded bg-blue-100 p-2"
      >
        <div className="pointer-events-none">
          <Image
            className="rounded"
            src="/sample-kitchen-image-2.jpg"
            alt="image"
            width={275}
            height={275}
          />
          <h3>Atley Throw Pillow</h3>
          <div className="flex items-center">
            <span className="mr-2 text-lg">{formatCurrency(3499)}</span>
            <span className="text-sm text-zinc-500 line-through">
              {formatCurrency(4799)}
            </span>
          </div>
        </div>
        <Rating
          starSize={20}
          totalRating={4.6}
          reviewsCount={299}
          style={RATING_STYLES.WITH_RATING}
        />
        <Button style={BUTTON_STYLES.BLUE} className="w-full">
          Select Options
        </Button>
      </div>
    );
  });

const MoreFromCreator = () => {
  return (
    <div className="flex w-full flex-col gap-2 border-y border-black py-2">
      <div className="flex items-center justify-between">
        <h2>
          More from
          <Link className="ml-2" href="/brand/test">
            TestBrand
          </Link>
        </h2>
        <Link href="/search?brand=test" className="text-lg">
          See All
        </Link>
      </div>
      <Carousel className="flex justify-between" items={carouselItems} />
    </div>
  );
};

export default MoreFromCreator;
