'use client';

import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-2">
      {children}
      {/*<MoreFromCreator />*/}
      {/*<Reviews />*/}
    </div>
  );
}
