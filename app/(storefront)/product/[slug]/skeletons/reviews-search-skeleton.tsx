import { Card } from '@/components/ui/common/card';
import { Input } from '@/components/ui/common/input';
import FiveStars from '@/components/ui/common/five-stars';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import React from 'react';

export default function ReviewsSearchSkeleton() {
  return (
    <div className="flex w-4/5 animate-pulse flex-col gap-2 rounded">
      <Card className="space-y-2 bg-secondary p-2">
        <div className="invisible flex flex-col gap-2 border-neutral-200 bg-secondary">
          <h3 className="font-medium">Looking for specific info?</h3>
          <Input type="text" placeholder="Search in reviews, Q&A..." />
        </div>
      </Card>
      <div className="flex flex-col gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card
            key={index}
            className="flex flex-col bg-secondary p-2 text-sm font-medium"
          >
            <div className="invisible">
              <div className="mb-2 flex items-center gap-1">
                <span className="h-[25px] w-[25px] rounded-full bg-gray-500" />
                <span className="text-md">Name</span>
              </div>
              <div className="flex items-center gap-1">
                <p className="text">
                  <span>Title</span>
                </p>
                <FiveStars rating={5} />
              </div>
              <p className="text-lg font-semibold">Title</p>
              <p>Body</p>
              <p className="flex gap-2 text-gray-500">Reviewed on 9999-99-99</p>
              <div className="py-2">
                <Carousel>
                  <CarouselContent>
                    {Array(10)
                      .fill(null)
                      .map((_, index) => (
                        <CarouselItem key={index}>
                          <Card className="h-[100px] w-[100px] rounded bg-secondary" />
                        </CarouselItem>
                      ))}
                  </CarouselContent>
                </Carousel>
              </div>
              {/*<div className="mt-2 flex gap-2">*/}
              {/*  <Button>Helpful</Button>*/}
              {/*  <Button>Report</Button>*/}
              {/* TODO add logic */}
              {/*</div>*/}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
