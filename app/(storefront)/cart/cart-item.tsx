import { FragmentType, useFragment } from '@/gql/generated';
import { CartLineFragmentFragmentDoc } from '@/gql/generated/graphql';
import { Card } from '@/components/ui/common/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/common/button';
import React from 'react';
import { QuantityInput } from '@/(storefront)/cart/quantity-input';
import { PriceData } from '@/gql/scalars';
import FiveStars from '@/components/ui/common/five-stars';

const CartItem = ({
  lineFragment,
  handleQuantityUpdate,
  isUpdating,
}: {
  lineFragment: FragmentType<typeof CartLineFragmentFragmentDoc>;
  handleQuantityUpdate: (sku: string, quantity: number) => void;
  isUpdating: boolean;
}) => {
  const line = useFragment(CartLineFragmentFragmentDoc, lineFragment);
  const { purchasable, subTotal, subTotalDiscounted, quantity } = line;
  const { name, prices, primaryImage, sku } = purchasable;
  const { price } = prices[0];
  const {
    product: { brand },
    values: productOptions,
    averageRating,
    reviewsCount,
  } = purchasable;
  const { originalUrl: imageUrl, name: imageAlt } = primaryImage;

  return (
    <Card className={cn('flex gap-4 p-4', isUpdating && 'animate-pulse')}>
      <Image
        className="rounded"
        src={imageUrl}
        alt={imageAlt}
        width={200}
        height={200}
      />
      <div className="flex w-full justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col">
            <h2 className="text-3xl">{name}</h2>
            <h3>
              <span>by </span>
              <Link
                className={cn(
                  buttonVariants({ variant: 'link', className: 'h-4 p-0' }),
                )}
                href={`/brand/${brand.defaultUrl.slug}`}
              >
                {brand.name}
              </Link>
              <span> | {sku}</span>
            </h3>
            <FiveStars
              averageRating={averageRating}
              reviewsCount={reviewsCount}
            />
          </div>
          <div>
            {productOptions?.map((value) => (
              <Badge key={value.name}>{value.name}</Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex flex-col items-end gap-1">
            <p className="text-2xl">{price.format}</p>
            <QuantityInput
              quantity={quantity}
              updateQuantity={handleQuantityUpdate.bind(null, sku)}
            />
          </div>
          <div className="text-xl">
            <ItemSubtotal
              subTotal={subTotal}
              subTotalDiscounted={subTotalDiscounted}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

const ItemSubtotal = ({
  subTotal,
  subTotalDiscounted,
}: {
  subTotal: PriceData;
  subTotalDiscounted: PriceData;
}) => {
  if (subTotalDiscounted.value !== subTotal.value) {
    return (
      <div className="flex flex-col items-end">
        <p className="text-primary/50 line-through">{subTotal.format}</p>
        <p className="text-2xl">Subtotal: {subTotalDiscounted.format}</p>
      </div>
    );
  }

  return <p className="text-2xl">Subtotal: {subTotal.format}</p>;
};

export default CartItem;
