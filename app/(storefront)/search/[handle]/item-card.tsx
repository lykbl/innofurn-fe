import { Discount, Product } from "@/gql/graphql";
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/common/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star } from "@/components/rating/rating-breakdown";
import { Button } from "@/components/ui/common/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export const Item = ({ product }: { product: Product }) => {
  if (!product || !product.variants) {
    return null;
  }

  const [selectedProductVariant, setSelectedProductVariant] = React.useState(product.variants[0]);
  const averageRating = selectedProductVariant.averageRating || 0;
  const reviewsCount = selectedProductVariant.reviewsCount || 0;
  const isFavorite = selectedProductVariant.isFavorite;
  const isFeatured = selectedProductVariant.isFeatured;
  const onSale = false;
  const colorOptions = product.variants?.map(variant => {
    if (!variant.attributes) {
      return;
    }

    return variant.attributes?.color;
  }).filter(Boolean);
  const extraLabel = selectedProductVariant.attributes?.material?.en; //TODO specify lang
  const discounts = [...product.discounts, ...selectedProductVariant.discounts];
  const priceData = selectedProductVariant.prices?.[0].price;

  return (
    <Card className="max-h flex flex-col">
      <CardHeader className="relative p-0 space-y-0">
        {isFeatured && (
          <Badge className="bg-pink-600 absolute top-0 left-0">New</Badge>
        )}
        {onSale && (
          <Badge className="bg-emerald-600 absolute top-0 left-0">Sale</Badge>
        )}
        <Image
          className="rounded-t w-full"
          width={225}
          height={225}
          alt={selectedProductVariant.images[0]?.name || 'Not found'}
          src={selectedProductVariant.images[0]?.originalUrl || '/sample-kitchen-image-2.jpg'}
        />
      </CardHeader>
      <CardContent className="flex flex-col justify-end p-2 bg-muted h-full">
        <ColorOptions values={colorOptions} />
        <p>{selectedProductVariant.name || product.name}</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex py-1 items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 })
                    .fill(null)
                    .map((_, index) => (
                      <Star
                        key={index}
                        isFilled={index + 1 < averageRating}
                        withGradient={index + 1 === Math.ceil(averageRating)}
                      />
                    ))}
                </div>
                ({reviewsCount})
              </div>
            </TooltipTrigger>
            <TooltipContent></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Price
          priceData={priceData}
          discounts={discounts}
        />
      </CardContent>
      <CardFooter className="bg-muted p-2 flex items-stretch">
        <ExtraBadge label={extraLabel} />
        <div className="ml-auto flex gap-1 justify-end">
          <Button className="p-2 h-7 w-7">
            <Icons.heart className={cn(isFavorite ? "fill-white" : "")} />
          </Button>
          <Button className="p-2 h-7 w-7">
            <Icons.cart className="fill-primary" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const ExtraBadge = ({ label }: { label: string }) => {
  if (!label) {
    return;
  }

  return (
    <Badge className="text-xs">{label}</Badge>
  );
}

const Price = ({ priceData, discounts }: { priceData, discounts: Array<Discount> }) => {
  const isOnSale = discounts.length > 0;
  const { currencyCode, currencyName, format, value } = priceData;
  const bestDiscount = discounts.reduce((prev, current) => {
    return applyDiscount(value, prev) > applyDiscount(value, current) ? prev : current;
  });
  const bestDiscountAmount = (applyDiscount(value, bestDiscount) / 100).toFixed(2);

  const centsToDollars = (cents: number) => {
    return cents / 100;
  }
  return (
    <div>
      {isOnSale ? (
        <div className="flex items-center gap-2">
              <span className="text-xl">
                {bestDiscountAmount}$
              </span>
          <p className="text-xs line-through text-foreground/50">
            {format}
          </p>
        </div>
      ) : (
        <p className="text-xl">{format}</p>
      )}
    </div>
  );
}

const ColorOptions = ({ values }: { values: Array<string> }) => {
  if (!values.length) {
    return;
  }

  return (
    <div className="flex gap-2 justify-center py-2">
      {
        values.sort((a, b) => a.label > b.label).map(({ label, value }, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipContent>
                {label}
              </TooltipContent>
              <TooltipTrigger>
                <span
                  style={{ backgroundColor: value }}
                  className="block rounded-full border border-solid border-black w-4 h-4"
                />
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        ))
      }
    </div>
  );
}

const applyDiscount = (price: number, discount: Discount, currency: 'USD' | 'EUR' = 'USD') => {
  if (discount.data.fixed_value) {
    const fixedAmountOff = Number(discount.data.fixed_values[currency]) * 100 || 0;
    return price - fixedAmountOff;
  }

  const percentageOff = price * 0.01 * Number(discount.data.percentage); //TODO cast to number BE
  return price - percentageOff;
}
