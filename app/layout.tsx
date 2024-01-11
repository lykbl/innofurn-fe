import '@/styles/global.css';
import React from 'react';
import { inter } from "@/components/fonts";
// import { ReactQueryProvider } from "@/lib/query-provider"; //TODO remove this
// import { GraphQLClientProvider } from "@/lib/graphql-client-provider";
import { ApolloWrapper } from "@/lib/apollo-provider";
import AuthContextProvider from "@/components/contexts/auth-context";

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
        <ApolloWrapper>
          <AuthContextProvider>
            {children}
          </AuthContextProvider>
        </ApolloWrapper>
      </body>
    </html>
  );
}
