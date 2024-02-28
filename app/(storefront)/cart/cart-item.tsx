import { FragmentType, useFragment } from '@/gql/generated';
import { CartLineFragmentFragmentDoc } from '@/gql/generated/graphql';
import { Card } from '@/components/ui/common/card';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn, formatToCurrency } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/common/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Icons } from '@/components/icons';
import React, { ChangeEventHandler, Dispatch, useState } from 'react';
import { Input } from '@/components/ui/common/input';
import { Star } from '@/components/rating/rating-breakdown';

const CartItem = ({
  lineFragment,
}: {
  lineFragment: FragmentType<typeof CartLineFragmentFragmentDoc>;
}) => {
  const line = useFragment(CartLineFragmentFragmentDoc, lineFragment);
  const { purchasable } = line;
  const { name, prices, primaryImage, sku } = purchasable;
  const { price } = prices?.[0] || {};
  const { brand } = purchasable.product;
  const { originalUrl, name: imageAlt } = primaryImage;
  const values = purchasable.values;
  const { averageRating, reviewsCount } = purchasable;
  const [quantity, setQuantity] = useState(line.quantity);

  return (
    <Card className="flex gap-4 p-4">
      <Image
        className="rounded"
        src={originalUrl}
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
            <div className="flex items-center gap-2 py-1">
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
          </div>
          <div>
            {values?.map((value) => (
              <Badge key={value.name}>{value.name}</Badge>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="flex flex-col items-end gap-1">
            <p className="text-2xl">$15.00</p>
            <p className="line-through">{price.format}</p>
            <QuantityInput quantity={quantity} setQuantity={setQuantity} />
          </div>
          <div className="text-xl">
            Subtotal: {formatToCurrency(price.value * quantity)}
          </div>
        </div>
      </div>
    </Card>
  );
};

const QuantityInput = ({
  quantity,
  setQuantity,
}: {
  quantity: number;
  setQuantity: Dispatch<React.SetStateAction<number>>;
}) => {
  const [isCustomQuantityMode, setIsCustomQuantityMode] = useState(false);
  const [buttonsView, setButtonsView] = useState(false);

  const handleOnClick = (newQuantity: number) => {
    if (newQuantity !== quantity) {
      setQuantity(newQuantity);
    }
    setButtonsView(false);
  };
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setQuantity(parseInt(e.target.value));
  };

  if (isCustomQuantityMode) {
    return (
      <Input
        type="number"
        className="w-16 rounded border border-secondary text-end"
        value={quantity}
        onChange={handleChange}
      />
    );
  }

  return (
    <Popover open={buttonsView}>
      <PopoverTrigger
        className="flex w-20 items-center justify-between gap-2 rounded border px-2 py-1"
        onClick={() => setButtonsView(!buttonsView)}
      >
        <span>Qty: </span>
        <span>{quantity}</span>
      </PopoverTrigger>
      <PopoverContent
        className="flex w-32 flex-col gap-1 p-2"
        onInteractOutside={() => setIsCustomQuantityMode(false)}
      >
        {Array.from({ length: 9 }, (_, index) => index + 1).map((i: number) => (
          <Button
            key={i}
            variant="ghost"
            className="justify-between"
            onClick={() => handleOnClick(i)}
          >
            {i}
            <Icons.check
              className={cn(i !== quantity && 'hidden')}
              width={16}
              height={16}
            />
          </Button>
        ))}
        <Button
          variant="ghost"
          className="content-start"
          onClick={() => setIsCustomQuantityMode(true)}
        >
          10+
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default CartItem;
