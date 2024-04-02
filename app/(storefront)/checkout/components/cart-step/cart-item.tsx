import { CartLineFragmentFragment } from '@/gql/generated/graphql';
import { Card } from '@/components/ui/common/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/common/button';
import React from 'react';
import { QuantityInput } from '@/(storefront)/checkout/components/cart-step/quantity-input';
import FiveStars from '@/components/ui/common/five-stars';
import ItemSubtotal from '@/(storefront)/checkout/components/cart-step/item-subtotal';
import { Icons } from '@/components/icons';

const CartItem = ({
  line,
  handleQuantityUpdate,
  handleClearCartItem,
  isUpdating,
}: {
  line: CartLineFragmentFragment;
  handleQuantityUpdate: (sku: string, quantity: number) => void;
  handleClearCartItem: (sku: string) => void;
  isUpdating: boolean;
}) => {
  const { purchasable, subTotal, subTotalDiscounted, quantity } = line;
  const { name, prices, primaryImage, sku } = purchasable;
  const { price } = prices[0];
  const {
    product: { brand },
    values: productOptions,
    averageRating,
    reviewsCount,
  } = purchasable;

  return (
    <Card className={cn('flex gap-4 p-4', isUpdating && 'animate-pulse')}>
      <Image
        className="rounded"
        src={primaryImage?.conversions[0] || 'https://via.placeholder.com/200'}
        alt={primaryImage?.name || 'Add alt here'}
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
            <FiveStars rating={averageRating} reviewsCount={reviewsCount} />
          </div>
          <div>
            {productOptions?.map((value) => (
              <Badge key={value.name}>{value.name}</Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between gap-6">
          <div className="flex flex-col items-end gap-1">
            <p className="text-2xl">{price.format}</p>
            <QuantityInput
              quantity={quantity}
              sku={sku}
              handleQuantityUpdate={handleQuantityUpdate}
            />
          </div>
          <div className="text-xl">
            <ItemSubtotal
              subTotal={subTotal}
              subTotalDiscounted={subTotalDiscounted}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button size="icon">
              <Icons.heart className="h-4 w-4" />
            </Button>
            <Button size="icon" onClick={() => handleClearCartItem(sku)}>
              <Icons.trash className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CartItem;
