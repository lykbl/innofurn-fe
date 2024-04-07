'use client';

import { Separator } from '@/components/ui/common/separator';
import { Suspense } from 'react';
import OrdersList from '@/(storefront)/settings/orders/orders-list';

export default function Page() {
  return (
    <div className="flex w-2/3 flex-col gap-4">
      <h2>Here are the products you bought</h2>
      <Separator />
      <Suspense fallback={<div>Add skeleotng</div>}>
        <OrdersList />
      </Suspense>
    </div>
  );
}
