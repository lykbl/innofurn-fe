import { FragmentType } from '@/gql/generated';
import { DiscountFragmentFragmentDoc } from '@/gql/generated/graphql';
import { PriceData } from '@/gql/scalars';
import React from 'react';
import { cn } from '@/lib/utils';

export default function Price({
  priceData,
  discounts,
  className,
}: {
  priceData: PriceData;
  discounts?: Array<FragmentType<typeof DiscountFragmentFragmentDoc>>;
  className?: string;
}) {
  const { format, value } = priceData;

  return (
    <span className={cn('text-xl font-semibold', className)}>{format}</span>
  );
}
