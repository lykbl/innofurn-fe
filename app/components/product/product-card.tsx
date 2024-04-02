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
  const averageRating = 3.2;
  const reviewsCount = 10;
  const selectedProductVariant = product.variantsPaginated.data[0];
  const priceData = selectedProductVariant.prices[0].price;

  return (
    <Card className="max-h flex w-60 flex-col gap-2 overflow-hidden rounded p-2">
      <Image
        className="w-full"
        width={225}
        height={225}
        alt={
          selectedProductVariant.primaryImage?.name ||
          selectedProductVariant.name ||
          ''
        }
        src={
          selectedProductVariant.primaryImage?.conversions[0] ||
          '/fallback-image.jpg'
        }
      />
      <div className="flex flex-col gap-1">
        <Button asChild variant="link" size="link" className="justify-start">
          <BaseLink href={`/product/${product.defaultUrl.slug}`}>
            <h3>{selectedProductVariant.name}</h3>
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
        {/* TODO add rating breakdown? */}
        {/*<TooltipProvider>*/}
        {/*  <Tooltip>*/}
        {/*    <TooltipTrigger>*/}
        <FiveStars
          rating={averageRating}
          reviewsCount={reviewsCount}
          size="sm"
        />
        {/*</TooltipTrigger>*/}
        {/*<TooltipContent></TooltipContent>*/}
        {/*</Tooltip>*/}
        {/*</TooltipProvider>*/}
        <p className="text-2xl font-semibold">{priceData.format}</p>
      </div>
      <Button className="w-full">Add to cart</Button>
    </Card>
  );
}
