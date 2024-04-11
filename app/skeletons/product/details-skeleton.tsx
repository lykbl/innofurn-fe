import { Card } from '@/components/ui/common/card';
import React from 'react';

export default function DetailsSkeleton() {
  return (
    <div className="flex animate-pulse gap-2">
      <Card className="h-80 w-1/2 p-2" />
      <Card className="top-0 flex h-80 w-1/2 p-2" />
    </div>
  );
}
