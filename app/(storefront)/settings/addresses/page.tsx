'use client';

import { Separator } from '@/components/ui/common/separator';
import AddressesList from '@/(storefront)/settings/addresses/addresses-list';
import { Suspense } from 'react';
import AddressesListSkeleton from '@/skeletons/address/addresses-list-skeleton';

export default function Page() {
  return (
    <div className="flex w-2/3 flex-col gap-4">
      <h2>List of your addresses</h2>
      <Separator />
      <Suspense fallback={<AddressesListSkeleton />}>
        <AddressesList />
      </Suspense>
    </div>
  );
}
