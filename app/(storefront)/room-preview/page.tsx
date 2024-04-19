import React, { Suspense } from 'react';
import Scene from '@/(storefront)/room-preview/scene';

export default async function Page({
}: {
}) {
  return (
    <div className="flex w-full gap-4 pb-10">
      <Suspense>
         <Scene />
      </Suspense>
    </div>
  );
}
