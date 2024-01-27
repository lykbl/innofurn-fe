"use client";

import { HttpLink, ApolloLink, from } from "@apollo/client";
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import React, { useEffect } from "react";
import { cookieSet, getCookie } from "@/lib/utils";
import PusherLink from "@/lib/apollo/pusher-link";
import Pusher from "pusher-js";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";
import { setContext } from "@apollo/client/link/context";
import { removeTypenameFromVariables } from "@apollo/client/link/remove-typename";

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions.code) {
          case "UNAUTHENTICATED":
            return forward(operation);
        }
      }
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  },
);

const removeTypeNamesLink = removeTypenameFromVariables();

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  credentials: "include",
  preserveHeaderCase: true,
});

let csrfRequesting = false;
const asyncAuthLink = setContext(
  () =>
    new Promise(async (success, fail) => {
      if (!cookieSet("XSRF-TOKEN") && !csrfRequesting) {
        csrfRequesting = true;
        await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/sanctum/csrf-cookie`, {
          method: "GET",
          credentials: "include",
        });
      }

      const csrfCookie = getCookie("XSRF-TOKEN");
      csrfCookie
        ? success({
            headers: {
              "X-XSRF-TOKEN": decodeURIComponent(csrfCookie),
            },
          })
        : fail("No XSRF-TOKEN cookie");
    }),
);

function createClient() {
  const links = [];
  if (typeof window === "undefined") {
    links.push(new SSRMultipartLink({ stripDefer: true }), httpLink);
  } else {
    const pusherLink = new PusherLink({
      pusher: new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? "", {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? "eu",
        authEndpoint:
          process.env.NEXT_PUBLIC_SUBSCRIPTIONS_AUTH_ENDPOINT ??
          `${process.env.NEXT_PUBLIC_API_HOST}/graphql/subscriptions/auth`,
      }),
    });
    links.push(
      pusherLink,
      asyncAuthLink,
      removeTypeNamesLink,
      errorLink,
      httpLink,
    );
  }
  return new NextSSRApolloClient({
    link: from(links),
    defaultOptions: {
      mutate: {
        errorPolicy: "all",
      },
      watchQuery: {
        notifyOnNetworkStatusChange: true,
      },
    },
    cache: new NextSSRInMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            chatRoomMessages: {
              // Don't cache separate results based on
              // any of this field's arguments.
              keyArgs: false,
            },
          },
        },
      },
    }),
  });
}

export const ApolloWrapper = ({ children }: React.PropsWithChildren) => (
  <ApolloNextAppProvider makeClient={createClient}>
    {children}
  </ApolloNextAppProvider>
);
