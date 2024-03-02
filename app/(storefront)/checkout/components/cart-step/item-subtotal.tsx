import { PriceData } from '@/gql/scalars';
import React from 'react';

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

export default ItemSubtotal;
