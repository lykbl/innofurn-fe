'use client';

import { useState } from 'react';
import { formatToCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/common/button';
import { PriceFragmentFragmentDoc } from '@/gql/generated/graphql';
import { FragmentType, useFragment } from '@/gql/generated';
import { useMutation } from '@apollo/client';
import { ADD_OR_UPDATE_PURCHASABLE } from '@/gql/mutations/cart';
import { Icons } from '@/components/icons';

const CartControl = ({
  priceFragment,
  sku,
}: {
  priceFragment: FragmentType<typeof PriceFragmentFragmentDoc>;
  sku: string;
}) => {
  const {
    price: { value },
  } = useFragment(PriceFragmentFragmentDoc, priceFragment);
  const [count, setCount] = useState<number>(1);
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1 || prev);
  const totalPrice = count > 1 ? value * count : value;
  const [addItem] = useMutation(ADD_OR_UPDATE_PURCHASABLE);
  const handleAddToCart = (sku: string, quantity: number) => {
    addItem({
      variables: { sku, quantity },
      updateQueries: {
        myCart: (prev, { mutationResult }) => {
          const newCartItem = mutationResult.data?.addOrUpdatePurchasable;
          if (!newCartItem) return prev;
          return {
            ...prev,
            lines: [...prev.lines, newCartItem],
          };
        },
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-2 rounded bg-secondary p-2">
      <Button onClick={() => handleAddToCart(sku, count)}>Add to cart</Button>
      <div className="flex gap-4">
        <div className="flex w-1/3 items-center justify-center gap-6 rounded bg-white outline outline-1 outline-black">
          <Button size="iconSm" onClick={decrement}>
            <Icons.minus />
          </Button>
          <span>
            {formatToCurrency(value)} x {count}
          </span>
          <Button size="iconSm" onClick={increment}>
            <Icons.plus />
          </Button>
        </div>
        <span className="w-1/3 text-center text-3xl">
          {formatToCurrency(totalPrice)}
        </span>
        <div className="flex w-1/3 justify-end gap-2">
          <Button
            variant="default"
          >
            <Icons.heart />
          </Button>
          {/*TODO add logic*/}
          {/*<Button*/}
          {/*  variant="outline"*/}
          {/*  className="border-blue-600 text-blue-600 hover:border-blue-700 hover:text-blue-700"*/}
          {/*>*/}
          {/*  <BiSearchAlt size={24} />*/}
          {/*</Button>*/}
        </div>
      </div>
    </div>
  );
};

export default CartControl;
