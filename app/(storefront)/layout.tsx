import "@/styles/global.css";
import Header from "@/components/ui/layout/header";
import React from "react";
import Subheader from "@/ui/storefront/layout/subheader";
import Footer from "@/ui/storefront/layout/footer";
import { inter } from "@/ui/fonts";
import { ReactQueryProvider } from "@/lib/query-provider";
import { ApolloWrapper } from "@/lib/apollo-provider";
// import { GraphQLClientProvider } from "@/lib/graphql-client-provider";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-screen"
    >
    <body className={`antialiased text-base flex items-center flex-col ${inter.className}`}>
      {/*<ReactQueryProvider>*/}
      {/*  <GraphQLClientProvider>*/}
      <ApolloWrapper>
          <header className="w-full">
            <Header />
            <Subheader />
          </header>
          <main className="max-w-screen-2xl w-full py-4 mx-auto flex flex-col items-center">
            {children}
          </main>
          <footer className="py-16 bg-neutral-100 w-full">
            <Footer />
          </footer>
      </ApolloWrapper>
        {/*</GraphQLClientProvider>*/}
      {/*</ReactQueryProvider>*/}
    </body>
    </html>
  );
}
