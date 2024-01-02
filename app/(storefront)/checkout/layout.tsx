'use client';

import '@/app/styles/global.scss';
import React from 'react';

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('checkout layout');

  return (
    children
  );
}
