'use client';

import { IoIosHeart } from 'react-icons/io';
import { BiMinus, BiPlus, BiSearchAlt } from 'react-icons/bi';
import { useState } from 'react';
import { formatToCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/common/button';
import { PriceFragmentFragmentDoc } from '@/gql/graphql';
import { FragmentType, useFragment } from '@/gql';

const CartControl = ({
  priceFragment,
}: {
  priceFragment: FragmentType<typeof PriceFragmentFragmentDoc>;
}) => {
  const {
    price: { value },
  } = useFragment(PriceFragmentFragmentDoc, priceFragment);
  const price = 0;
  const [count, setCount] = useState<number>(1);
  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1 || prev);
  const totalPrice = count > 1 ? value * count : value;

  return (
    <div className="flex w-full flex-col gap-2 rounded bg-secondary p-2">
      <Button>Add to cart</Button>
      <div className="flex gap-4">
        <div className="flex w-1/3 items-center justify-center gap-6 rounded bg-white outline outline-1 outline-black">
          <Button className="h-min p-0" onClick={decrement}>
            <BiMinus size={24} />
          </Button>
          <span>
            {formatToCurrency(value)} x {count}
          </span>
          <Button className="h-min p-0" onClick={increment}>
            <BiPlus size={24} />
          </Button>
        </div>
        <span className="w-1/3 text-center text-3xl">
          {formatToCurrency(totalPrice)}
        </span>
        <div className="flex w-1/3 justify-end gap-2">
          <Button
            variant="outline"
            className="border-pink-500 text-pink-500 hover:border-pink-700 hover:text-pink-700"
          >
            <IoIosHeart size={24} />
          </Button>
          <Button
            variant="outline"
            className="border-blue-600 text-blue-600 hover:border-blue-700 hover:text-blue-700"
          >
            <BiSearchAlt size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartControl;
