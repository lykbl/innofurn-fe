'use client';

import '@/styles/global.css';
import React from 'react';
import { AuthControls } from '@/(auth)/header';
import { Button, buttonVariants } from '@/components/ui/common/button';
import { redirect } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { CheckMeQuery } from '@/gql/queries/user';
import BaseLink from 'next/link';
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: checkMeQuery } = useQuery(CheckMeQuery);
  if (checkMeQuery?.checkMe) {
    redirect('/');
  }

  return (
    <div className="h-screen w-full">
      <header className="fixed flex justify-between bg-transparent p-2">
        <div>
          {/* TODO add logo */}
          <Button variant="ghost">Logo goes here...</Button>
        </div>
        <div className="flex gap-2">
          <BaseLink
            className={buttonVariants({
              variant: 'outline',
            })}
            href="/"
          >
            Homepage
          </BaseLink>
          <AuthControls />
        </div>
      </header>
      <main className="flex flex-col xl:flex-row">
        <div className="h-1/2 w-full bg-primary xl:h-full"></div>
        <div className="flex w-full items-center justify-center bg-secondary">
          {children}
        </div>
      </main>
    </div>
  );
}
