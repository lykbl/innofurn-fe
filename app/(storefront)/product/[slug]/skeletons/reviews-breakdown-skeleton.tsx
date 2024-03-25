import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/common/card';
import FiveStars from '@/components/ui/common/five-stars';
import { Button } from '@/components/ui/common/button';

import RatingBar from '@/(storefront)/product/[slug]/components/reviews/rating-bar';

export default function ReviewsBreakdownSkeleton() {
  return (
    <div className="sticky top-2 flex h-max w-1/5 animate-pulse flex-col gap-2 rounded">
      <Card className="bg-secondary p-2">
        <div className="invisible">
          <h2>Customer Reviews</h2>
          <div className="flex flex-col gap-2 border-primary">
            <div className="flex gap-2 text-lg">
              <FiveStars rating={5} />
              <span>5 of 5</span>
            </div>
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, index) => (
                <Button
                  variant="outline"
                  className={cn(
                    'group flex w-full border-primary bg-transparent text-black hover:bg-transparent hover:text-primary/90 hover:underline',
                  )}
                  key={index}
                >
                  <span className="w-1/5 text-left">X star</span>
                  <RatingBar className="h-[24px] w-3/5" fillTo={100} />
                  <span className="w-1/5 text-right">100%</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
      <Card className="flex flex-col gap-2 bg-secondary p-2">
        <div className="invisible">
          <h5 className="font-semibold">Review this product</h5>
          <span className="text-sm">
            Share your thoughts with other customers
          </span>
          <Button className="py-1">Leave a review</Button>
        </div>
      </Card>
    </div>
  );
}
