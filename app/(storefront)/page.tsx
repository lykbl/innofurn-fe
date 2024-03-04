'use client';

import { useQuery } from '@apollo/client';
import BaseLink from 'next/link';
import { UserReviewsQuery } from '@/gql/queries/product';
import { Card } from '@/components/ui/common/card';
import Image from 'next/image';
import { Button } from '@/components/ui/common/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/common/separator';
import { Input } from '@/components/ui/common/input';

const OutlinedLink = ({
  children,
  className,
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) => {
  return (
    <Link
      className={cn(
        "flex p-1 border border-transparent hover:border-primary rounded transition-all",
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  )
}
export default function Page() {
  const { loading: isLoading, data } = useQuery(UserReviewsQuery);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data || !data.userReviews) {
    return <p>No data!!</p>;
  }

  return (
    <div className="flex-col flex gap-2">
      <div className="flex flex-col w-full">
        <div className="flex gap-1 w-full">
          <OutlinedLink
            className="w-1/2 h-full"
            href="/product/adde"
          >
            <Image
              src="https://via.placeholder.com/782x600.png/004466?text=featured-promo"
              alt="alt"
              width={782}
              height={295}
              className="rounded"
            />
          </OutlinedLink>
          <div className="flex flex-col w-1/2">
            {Array.from({ length: 2 }).map((_, i) => (
                <OutlinedLink
                  href="/product/adde"
                >
                  <Image
                    src="https://via.placeholder.com/782x295.png/004466?text=featured-promo"
                    alt="alt"
                    width={782}
                    height={295}
                    className="rounded"
                  />
                </OutlinedLink>
            ))}
          </div>
        </div>
        <Carousel>
            <CarouselContent className="p-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <CarouselItem
                  className="basis-1/6"
                >
                  <div className="hover:outline outline-1 outline-primary outline-offset-4 rounded">
                    <Link
                      href="/product/adde"
                    >
                      <Image
                        src="https://via.placeholder.com/250x150.png/004466?text=featured-promo"
                        alt="alt"
                        width={250}
                        height={150}
                        className="rounded"
                      />
                    </Link>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
      </div>
      <div>
        <OutlinedLink
          href="/product/adde"
          className="flex"
        >
          <Image
            src="https://via.placeholder.com/1600x300.png/004466?text=featured-promo"
            alt="test"
            width={1600}
            height={300}
            className="rounded"
          />
        </OutlinedLink>
      </div>
      <div className="flex flex-wrap justify-between">
        {Array.from({ length: 14 }).map((_, i) => (
          <OutlinedLink
            href="/product/adde"
            key={i}
          >
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
      <Card className="flex flex-col w-full items-center">
        <div className="flex w-2/5 py-10 items-center justify-between">
          <span>Be the first to know about our best deals!</span>
          <div className="flex">
            <Input placeholder="Your email" className="rounded-r-none" />
            <Button className="rounded-l-none">
              Submit
            </Button>
          </div>
        </div>
      </Card>
      {/*Main page*/}
      {/*/!*{user && <p>Hello there {user.name}!</p>}*!/*/}
      {/*<BaseLink href="/product/adde">Product page</BaseLink>*/}
      {/*<div>*/}
      {/*  Reviews:*/}
      {/*  <div className="flex flex-col">*/}
      {/*    {data.userReviews.map((review: any) => (*/}
      {/*      <div key={review.id}>*/}
      {/*        <h2>Title: {review.title}</h2>*/}
      {/*        <p>Body: {review.body}</p>*/}
      {/*      </div>*/}
      {/*    ))}*/}
      {/*  </div>*/}
      {/*</div>*/}
    </div>
  );
}
