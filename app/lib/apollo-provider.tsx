"use client";

import { HttpLink, ApolloLink, from } from "@apollo/client";
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import React, { useEffect } from "react";
import { getCookie } from "@/lib/utils";
import { onError } from "@apollo/client/link/error";

const errorHandler = (errors: any) => {
  console.log('Showing errors:' ,errors);
}

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      'X-XSRF-TOKEN': decodeURIComponent(getCookie("XSRF-TOKEN") || ''),
    }
  }));
  return forward(operation);
});

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  credentials: 'include',
  preserveHeaderCase: true,
});

const masterLink = ApolloLink.from([
  typeof window === "undefined"
    ? ApolloLink.from([
      onError(errorHandler),
      new SSRMultipartLink({
        stripDefer: true,
      }),
      httpLink,
    ])
    : httpLink,
]);

function createClient() {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: from([
      authMiddleware,
      masterLink,
    ]),
    defaultOptions: {
      mutate: {
        errorPolicy: 'all',
      }
    }
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  useEffect(() => {
    async function initCsrf() {
      await fetch('http://localhost/sanctum/csrf-cookie', { // TODO keep old one?
        'method': 'GET',
        'credentials': 'include',
      })
    }

    initCsrf();
  }, []);

  return (
    <ApolloNextAppProvider makeClient={ createClient }>
      { children }
    </ApolloNextAppProvider>
  );
}
