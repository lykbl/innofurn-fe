'use client';

import Image from 'next/image';
import OutlinedLink from '@/(storefront)/components/outlined-link';

const FeaturedCardsSkeleton = () => {
  return (
    <div className="flex w-full justify-between gap-1">
      {Array.from({ length: 4 }).map((_, i) => (
        <OutlinedLink
          href="/404"
          key={i}
          className="pointer-events-none animate-pulse"
        >
          <Image
            src={'https://via.placeholder.com/400x400.png/004466?text=fallback'}
            alt="alt"
            width={400}
            height={400}
            className="rounded"
          />
        </OutlinedLink>
      ))}
    </div>
  );
};

export default FeaturedCardsSkeleton;
