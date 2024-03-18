import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/common/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/common/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useFragment } from '@/gql/generated';
import {
  ColorOptionFragmentFragmentDoc,
  DiscountFragmentFragmentDoc,
  ProductVariantGridFragmentFragment,
} from '@/gql/generated/graphql';
import FiveStars from '@/components/ui/common/five-stars';
import Price from '@/(storefront)/search/[collectionSlug]/components/card-item/price';

export default function CardItem({
  productVariant,
}: {
  productVariant: ProductVariantGridFragmentFragment;
}) {
  const defaultVariant = productVariant;
  const [selectedProductVariant, setSelectedProductVariant] =
    React.useState(defaultVariant);
  const averageRating = selectedProductVariant.averageRating || 0;
  const reviewsCount = selectedProductVariant.reviewsCount || 0;
  const isFavorite = selectedProductVariant.isFavorite;
  const isFeatured = selectedProductVariant.isFeatured;
  const onSale = false;
  const colorOptions = productVariant.product.colorOptions?.map((colorOption) =>
    useFragment(ColorOptionFragmentFragmentDoc, colorOption),
  );
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
    <Card className="max-h flex flex-col">
      <CardHeader className="relative space-y-0 p-0">
        {isFeatured && (
          <Badge className="absolute left-0 top-0 bg-pink-600">New</Badge>
        )}
        {onSale && (
          <Badge className="absolute left-0 top-0 bg-emerald-600">Sale</Badge>
        )}
        <Image
          className="w-full rounded-t"
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
        <p>{selectedProductVariant.name}</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiveStars
                averageRating={averageRating}
                reviewsCount={reviewsCount}
              />
            </TooltipTrigger>
            <TooltipContent></TooltipContent>
          </Tooltip>
        </TooltipProvider>
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
