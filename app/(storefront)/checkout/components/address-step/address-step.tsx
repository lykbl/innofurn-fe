import React, { Suspense } from 'react';
import AddressesList from '@/components/address/addresses-list/addresses-list';
import AddressesListSkeleton from '@/skeletons/address/addresses-list-skeleton';

export default function AddressStep() {
  return (
    <Suspense fallback={<AddressesListSkeleton />}>
      <AddressesList />
    </Suspense>
  );
}
