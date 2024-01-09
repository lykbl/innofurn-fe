import '@/styles/global.css';
import React from 'react';
import { inter } from "@/ui/fonts";
import { ReactQueryProvider } from "@/lib/query-provider";
// import { GraphQLClientProvider } from "@/lib/graphql-client-provider";
import { AuthControls } from "@/ui/auth/layout/header";
import { Button } from "@/components/ui/common/button";
import { ApolloWrapper } from "@/lib/apollo-provider";

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
    <html
      lang='en'
      className='h-screen'
    >
    <body className={`antialiased text-base flex items-center flex-col ${inter.className}`}>
      {/*<ReactQueryProvider>*/}
        {/*<GraphQLClientProvider>*/}
          <ApolloWrapper>
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
          </ApolloWrapper>
        {/*</GraphQLClientProvider>*/}
      {/*</ReactQueryProvider>*/}
    </body>
    </html>
  );
}
