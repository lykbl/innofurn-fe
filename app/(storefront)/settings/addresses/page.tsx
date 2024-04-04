'use client';

import { Separator } from '@/components/ui/common/separator';
import AddressesList from '@/(storefront)/settings/addresses/addresses-list';
import { Suspense } from 'react';

export default function Page() {
  return (
    <div className="flex w-2/3 flex-col gap-4">
      <div>
        <h2>List of your addresses</h2>
      </div>
      <Separator />
      <Suspense fallback={123}>
        <AddressesList />
      </Suspense>
    </div>
  );
}
