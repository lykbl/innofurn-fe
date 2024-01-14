"use client";

import { HttpLink, ApolloLink, from, split, concat } from "@apollo/client";
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import React, { useEffect } from "react";
import { getCookie } from "@/lib/utils";
import { onError } from "@apollo/client/link/error";
import { createClient as createWsClient } from 'graphql-ws';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from "@apollo/client/utilities";
import PusherLink from "@/lib/apollo/pusher-link";
import Pusher from "pusher-js";
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

const wsLink = new GraphQLWsLink(createWsClient({
  url: 'ws://localhost/subscriptions',
  connectionParams: {
    'X-XSRF-TOKEN': decodeURIComponent(getCookie("XSRF-TOKEN") || ''),
  },
}));

const pusherLink = new PusherLink({
  pusher: new Pusher(process.env.NEXT_PUBLIC_VITE_PUSHER_APP_KEY ?? '', {
    cluster: process.env.NEXT_PUBLIC_VITE_PUSHER_APP_CLUSTER ?? 'eu',
    authEndpoint: process.env.NEXT_PUBLIC_SUBSCRIPTIONS_AUTH_ENDPOINT ?? 'http://localhost/graphql/subscriptions/auth',
    auth: {
      headers: {},
    },
  }),
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

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
)

function createClient() {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: concat(
      authMiddleware,
      // splitLink,
      from([
        // pusherLink,
        httpLink,
      ]),
    ),
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
