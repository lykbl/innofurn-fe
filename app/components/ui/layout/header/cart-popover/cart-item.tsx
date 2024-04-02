import { FragmentType, useFragment } from '@/gql/generated';
import { CartLineFragmentFragmentDoc } from '@/gql/generated/graphql';
import { useMutation } from '@apollo/client';
import Image from 'next/image';
import { formatToCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/common/button';
import { Separator } from '@/components/ui/common/separator';
import * as React from 'react';
import { ClearCartMutation } from '@/gql/queries/cart';
import { Icons } from '@/components/icons';

export const CartItem = ({
  lineFragment,
}: {
  lineFragment: FragmentType<typeof CartLineFragmentFragmentDoc>;
}) => {
  const line = useFragment(CartLineFragmentFragmentDoc, lineFragment);
  const [clearItemMutation] = useMutation(ClearCartMutation);

  const handleClearItem = (sku: string) => {
    clearItemMutation({
      variables: { sku },
    });
  };

  return (
    <li className="flex gap-2 rounded border-b border-solid border-secondary p-1">
      <Image
        className="w-1/3"
        src={
          line.purchasable.primaryImage?.conversions[0] ||
          'https://via.placeholder.com/75'
        }
        alt={line.purchasable.primaryImage?.name || ''}
        width={50}
        height={50}
      />
      <div className="w-2/3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <h4>{line.purchasable.name}</h4>
            <p>
              {line.quantity} x{' '}
              {formatToCurrency(line.purchasable.prices[0].price.value)}
            </p>
          </div>
          <Button
            variant="outline"
            size="iconSm"
            onClick={() => handleClearItem(line.purchasable.sku)}
          >
            <Icons.x />
          </Button>
        </div>
        <Separator orientation="horizontal" className="my-0.5" />
        <span className="text-foreground">
          Subtotal: {line.subTotalDiscounted.format}
        </span>
      </div>
    </li>
  );
};
