import { FragmentType, useFragment } from '@/gql/generated';
import { CartLineFragmentFragmentDoc } from '@/gql/generated/graphql';
import { useMutation } from '@apollo/client';
import Image from 'next/image';
import { formatToCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/common/button';
import { XIcon } from 'lucide-react';
import { Separator } from '@/components/ui/common/separator';
import * as React from 'react';
import { CLEAR_CART_MUTATION } from '@/gql/queries/cart';

export const CartItemLine = ({
  lineFragment,
}: {
  lineFragment: FragmentType<typeof CartLineFragmentFragmentDoc>;
}) => {
  const line = useFragment(CartLineFragmentFragmentDoc, lineFragment);
  const [clearItemMutation] = useMutation(CLEAR_CART_MUTATION);

  const handleClearItem = (sku: string) => {
    clearItemMutation({
      variables: { sku },
    });
  };

  return (
    <li className="flex gap-2 rounded border-b border-solid border-secondary p-1">
      <Image
        className="w-1/3"
        src={line.purchasable.primaryImage.originalUrl}
        alt={line.purchasable.primaryImage.name}
        width={50}
        height={50}
      />
      <div className="w-2/3 text-xs">
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <h4>{line.purchasable.name}</h4>
            <p>
              {line.quantity} x{' '}
              {formatToCurrency(line.purchasable.prices[0].price.value)}
            </p>
          </div>
          <Button
            className="p-1"
            variant="ghost"
            onClick={() => handleClearItem(line.purchasable.sku)}
          >
            <XIcon size={10} />
          </Button>
        </div>
        <Separator orientation="horizontal" className="my-0.5" />
        <span className="text-foreground">
          Subtotal:{' '}
          {formatToCurrency(
            line.quantity * line.purchasable.prices[0].price.value,
          )}
        </span>
      </div>
    </li>
  );
};
