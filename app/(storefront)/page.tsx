import { Card } from '@/components/ui/common/card';
import { Button } from '@/components/ui/common/button';
import { Input } from '@/components/ui/common/input';
import FeaturedCarousel from '@/(storefront)/components/featured-carousel';
import FeaturedCards from '@/(storefront)/components/featured-cards';
import FeaturedPanel from '@/(storefront)/components/featured-panel';
import React from 'react';
import Collections from '@/(storefront)/components/collections';

export default function Page() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex w-full flex-col">
        <FeaturedCards />
        <FeaturedCarousel />
      </div>
      <div>
        <FeaturedPanel />
      </div>
      <Collections />
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
