import '@/styles/global.css';
import React from 'react';
// import { ReactQueryProvider } from "@/lib/query-provider"; //TODO remove this
// import { GraphQLClientProvider } from "@/lib/graphql-client-provider";
import { AuthControls } from "@/(auth)/header";
import { Button } from "@/components/ui/common/button";
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: 'Rename Me',
  description: 'Update me',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen">
      <header className="w-full flex fixed bg-transparent p-2 justify-between">
        <div>
          {/* TODO add logo */}
          <Button variant="ghost">
            Logo goes here...
          </Button>
        </div>
        <div>
          <AuthControls />
        </div>
      </header>
      <main className="w-full flex flex-col xl:flex-row">
        <div className="w-full bg-primary xl:h-full h-1/2">
        </div>
        <div className="w-full flex items-center justify-center bg-gray-100">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
