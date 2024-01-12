// import '@/styles/global.css';
import '@/styles/output.css';
import React from 'react';
// import { ReactQueryProvider } from "@/lib/query-provider"; //TODO remove this
// import { GraphQLClientProvider } from "@/lib/graphql-client-provider";
import { ApolloWrapper } from "@/lib/apollo-provider";
import AuthContextProvider from "@/components/contexts/auth-context";
import { cn } from "@/lib/utils";
import { inter } from "@/components/fonts";
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
    <html
      lang='en'
      className='h-screen'
    >
      <body className={cn(
        'antialiased text-base flex items-center flex-col',
        inter.variable,
      )}>
        <ApolloWrapper>
          <AuthContextProvider>
            {children}
            <Toaster />
          </AuthContextProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
