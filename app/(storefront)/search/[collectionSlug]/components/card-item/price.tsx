import { FragmentType } from '@/gql/generated';
import { DiscountFragmentFragmentDoc } from '@/gql/generated/graphql';
import { PriceData } from '@/gql/scalars';
import React from 'react';

export default function Price({
  priceData,
  discounts,
}: {
  priceData: PriceData;
  discounts: Array<FragmentType<typeof DiscountFragmentFragmentDoc>>;
}) {
  const isOnSale = discounts.length > 0;
  const { format, value } = priceData;
  // const bestDiscountAmount = calculateBestDiscountAmount(discounts, value);

  return (
    <div>
      {/*{isOnSale && bestDiscountAmount ? (*/}
      {/*  <div className="flex items-center gap-2">*/}
      {/*    <span className="text-xl">{bestDiscountAmount.toFixed(2)}$</span>*/}
      {/*    <p className="text-xs text-foreground/50 line-through">{format}</p>*/}
      {/*  </div>*/}
      {/*) : (*/}
      <p className="text-xl">{format}</p>
      {/*)}*/}
    </div>
  );
}

// function applyDiscount(
//   price: number,
//   discountFragment: FragmentType<typeof DiscountFragmentFragmentDoc>,
//   // currency: 'USD' | 'EUR' = 'EUR',
// ) {
//   const discount = useFragment(DiscountFragmentFragmentDoc, discountFragment);
//   // if (discount.data.fixed_value) {
//   //   return price;
//   // TODO add cart logic
//   // const fixedAmountOff = Number(discount.data.fixed_values[currency]) * 100 || 0;
//   //
//   // return price - fixedAmountOff;
//   // }
//
//   const percentageOff = price * 0.01 * Number(discount.data.percentage); //TODO cast to number BE
//   return price - percentageOff;
// }

// function calculateBestDiscountAmount(
//   discounts: Array<FragmentType<typeof DiscountFragmentFragmentDoc>>,
//   value: number,
// ): number {
//   if (!discounts.length) {
//     return 0;
//   }
//
//   const bestDiscount = discounts.reduce((prev, current) =>
//     applyDiscount(value, prev) < applyDiscount(value, current) ? prev : current,
//   );
//
//   return applyDiscount(value, bestDiscount) / 100;
// }
