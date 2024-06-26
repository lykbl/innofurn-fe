import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/common/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

import { Button } from '@/components/ui/common/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useFragment } from '@/gql/generated';
import {
  DiscountFragmentFragmentDoc,
  ProductVariantGridFragmentFragment,
} from '@/gql/generated/graphql';
import Price from '@/(storefront)/search/[collectionSlug]/components/card-item/price';
import FiveStars from '@/components/ui/common/five-stars';
import BaseLink from 'next/link';

export default function CardItem({
  productVariant,
}: {
  productVariant: ProductVariantGridFragmentFragment;
}) {
  // const defaultVariant = productVariant;
  // const [selectedProductVariant, setSelectedProductVariant] =
  //   React.useState(defaultVariant);
  const selectedProductVariant = productVariant;
  const averageRating = selectedProductVariant.averageRating || 0;
  const reviewsCount = selectedProductVariant.reviewsCount || 0;
  const isFavorite = selectedProductVariant.isFavorite;
  const isFeatured = selectedProductVariant.isFeatured;
  const onSale = false;
  // const colorOptions = productVariant.product.colorOptions?.map((colorOption) =>
  //   useFragment(ColorOptionFragmentFragmentDoc, colorOption),
  // );
  const discounts = [
    // ...product.discounts,
    ...selectedProductVariant.discounts,
  ].filter(
    (discount) =>
      !useFragment(DiscountFragmentFragmentDoc, discount).data.fixed_value,
  );
  const priceData = selectedProductVariant.prices?.[0].price;
  // const previewVariantColor = (variantId: number) => {
  //   const previewVariant = product.variants?.find(
  //     (variant) => variant.id === variantId,
  //   );
  //   if (previewVariant) {
  //     setSelectedProductVariant(previewVariant);
  //   }
  // };

  return (
    <Card className="max-h flex flex-col overflow-hidden rounded">
      <CardHeader className="relative space-y-0 p-0">
        {isFeatured && (
          <Badge className="absolute left-0 top-0 bg-pink-600">New</Badge>
        )}
        {onSale && (
          <Badge className="absolute left-0 top-0 bg-emerald-600">Sale</Badge>
        )}
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
      </CardHeader>
      <CardContent className="flex flex-col justify-end bg-secondary p-2">
        {/*<RelevantAlternatives*/}
        {/*  colorOptions={colorOptions}*/}
        {/*  previewVariantColor={previewVariantColor}*/}
        {/*/>*/}
        <Button
          asChild
          variant="link"
          className="text-md h-full justify-start p-0 text-start"
        >
          <BaseLink
            href={`/product/${selectedProductVariant.product.defaultUrl.slug}`}
          >
            <p>{selectedProductVariant.name}</p>
          </BaseLink>
        </Button>
        <FiveStars rating={averageRating} reviewsCount={reviewsCount} />
        <Price priceData={priceData} discounts={discounts} />
      </CardContent>
      <CardFooter className="flex items-stretch bg-secondary p-2">
        <div className="ml-auto flex justify-end gap-1">
          <Button className="h-7 w-7 p-2">
            <Icons.heart className={cn(isFavorite ? 'fill-white' : '')} />
          </Button>
          <Button className="h-7 w-7 p-2">
            <Icons.cart />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
