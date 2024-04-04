import { Card } from '@/components/ui/common/card';
import React from 'react';

export default function AddressesListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 3 }, (_, i) => (
        <Card
          key={i}
          className="flex h-52 w-full animate-pulse rounded border border-input p-4"
        />
      ))}
    </div>
  );
}
