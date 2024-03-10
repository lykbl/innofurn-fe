import { Card } from '@/components/ui/common/card';
import Image from 'next/image';
import { Button } from '@/components/ui/common/button';
import { Input } from '@/components/ui/common/input';
import FeaturedCarousel from '@/(storefront)/components/featured-carousel';
import FeaturedCards from '@/(storefront)/components/featured-cards';
import OutlinedLink from '@/(storefront)/components/outlined-link';
import FeaturedPanel from '@/(storefront)/components/featured-panel';
import FeaturedCardsSkeleton from '@/(storefront)/skeletons/featured-cards-skeleton';
import React, { Suspense } from 'react';
import FeaturedCarouselSkeleton from '@/(storefront)/skeletons/featured-carousel-skeleton';
import FeaturedPanelSkeleton from '@/(storefront)/skeletons/featured-panel-skeleton';
import dynamic from 'next/dynamic';

const DynamicFeaturedCards = dynamic(
  () => import('@/(storefront)/components/featured-cards'),
  {
    loading: () => <FeaturedCardsSkeleton />,
    ssr: false,
  },
);

const DynamicFeaturedCarousel = dynamic(
  () => import('@/(storefront)/components/featured-carousel'),
  {
    loading: () => <FeaturedCarouselSkeleton />,
    ssr: false,
  },
);

const DynamicFeaturedPanel = dynamic(
  () => import('@/(storefront)/components/featured-panel'),
  {
    loading: () => <FeaturedPanelSkeleton />,
    ssr: false,
  },
);

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-col">
        <DynamicFeaturedCards />
        <DynamicFeaturedCarousel />
      </div>
      <div>
        <DynamicFeaturedPanel />
      </div>
      <div className="flex flex-wrap justify-between">
        {Array.from({ length: 14 }).map((_, i) => (
          <OutlinedLink href="/product/adde" key={i}>
            <Image
              src="https://via.placeholder.com/205x205.png/004466?text=featured-promo"
              alt="alt"
              width={205}
              height={205}
              className={i === 0 ? 'rounded-full' : 'rounded'}
            />
          </OutlinedLink>
        ))}
      </div>
      <Card className="flex w-full flex-col items-center">
        <div className="flex w-2/5 items-center justify-between py-10">
          <span>Be the first to know about our best deals!</span>
          <div className="flex">
            <Input placeholder="Your email" className="rounded-r-none" />
            <Button className="rounded-l-none">Submit</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
