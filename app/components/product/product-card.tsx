import { ProductCardFragmentFragment } from '@/gql/generated/graphql';
import { Card } from '@/components/ui/common/card';
import Image from 'next/image';
import { Button } from '@/components/ui/common/button';
import BaseLink from 'next/link';
import FiveStars from '@/components/ui/common/five-stars';
import React from 'react';

export default function ProductCard({
  product,
}: {
  product: ProductCardFragmentFragment;
}) {
  return (
    <Card className="flex h-108 w-60 flex-col gap-2 overflow-hidden rounded p-2">
      <Image
        className="w-full"
        width={225}
        height={225}
        alt={product.primaryImage?.name || product.name || ''}
        src={product.primaryImage?.conversions[0] || '/fallback-image.jpg'}
      />
      <div className="flex flex-col gap-1">
        <Button asChild variant="link" size="link" className="justify-start">
          <BaseLink href={`/product/${product.defaultUrl.slug}`}>
            <h3>{product.name}</h3>
          </BaseLink>
        </Button>
        <Button
          asChild
          variant="link"
          size="link"
          className="justify-start text-xs"
        >
          <BaseLink href={`/brand/${product.brand.defaultUrl.slug}`}>
            <h4>By {product.brand.name}</h4>
          </BaseLink>
        </Button>
        <FiveStars
          rating={product.averageRating}
          reviewsCount={product.reviewsCount}
          size="sm"
        />
        <p id="hehe" className="text-2xl font-semibold">
          {product.startingPrice?.price.format || 'Price unavailable'}
        </p>
      </div>
      <Button className="w-full">Add to cart</Button>
    </Card>
  );
}
