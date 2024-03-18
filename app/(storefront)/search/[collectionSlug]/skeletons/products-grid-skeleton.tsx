import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/common/card';
import Image from 'next/image';

export default function ProductsGridSkeleton() {
  return (
    <div className="pointer-events-none grid animate-pulse gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <Card className="max-h flex flex-col" key={i}>
          <CardHeader className="relative space-y-0 p-0">
            <Image
              className="w-full rounded-t"
              width={225}
              height={225}
              alt={'Skeleton fallback image'}
              src="/fallback-image.jpg"
            />
          </CardHeader>
          <CardContent className="h-36 bg-muted p-2" />
        </Card>
      ))}
    </div>
  );
}
