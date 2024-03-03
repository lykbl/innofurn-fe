'use client';

import '@/styles/global.css';
import React from 'react';
// import { ReactQueryProvider } from "@/lib/query-provider"; //TODO remove this
// import { GraphQLClientProvider } from "@/lib/graphql-client-provider";
import { AuthControls } from '@/(auth)/header';
import { Button } from '@/components/ui/common/button';
import { redirect } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { CheckMeQuery } from '@/gql/queries/user';
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
        <div>
          <AuthControls />
        </div>
      </header>
      <main className="flex flex-col xl:flex-row">
        <div className="h-1/2 w-full bg-primary xl:h-full"></div>
        <div className="flex w-full items-center justify-center bg-gray-100">
          {children}
        </div>
      </main>
    </div>
  );
}
