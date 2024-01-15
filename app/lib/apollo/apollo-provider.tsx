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
import PusherLink from "@/lib/apollo/pusher-link";
import Pusher from "pusher-js";

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

function createClient() {
  const links = [authMiddleware];
  if (typeof window === 'undefined') {
    links.push(new SSRMultipartLink({stripDefer: true}), httpLink);
  } else {
    const pusherLink = new PusherLink({
      pusher: new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '', {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? 'eu',
        authEndpoint: process.env.NEXT_PUBLIC_SUBSCRIPTIONS_AUTH_ENDPOINT ?? 'http://localhost/graphql/subscriptions/auth',
        auth: {
          headers: {},
        },
      }),
    });
    links.push(pusherLink, httpLink);
  }
  return new NextSSRApolloClient({
    // connectToDevTools: true,
    link: from(links),
    defaultOptions: {
      mutate: {
        errorPolicy: 'all',
      },
      // query: {
      //   notifyOnNetworkStatusChange: true,
      // },
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
              merge(existing = {}, incoming, { toReference, isReference, readField, ...extra }) {
                //TODO better way to detect new messages?
                let isNewMessage = false;
                if (existing?.data && incoming?.data) {
                  const latestExistingId = readField('id', existing.data.slice(-1)[0]);
                  const newestIncomingId = readField('id', incoming.data[0]);
                  if (latestExistingId && newestIncomingId) {
                    isNewMessage = newestIncomingId > latestExistingId;
                  }
                }

                return {
                  paginatorInfo: incoming.paginatorInfo,
                  data: isNewMessage && existing.data
                    ? [...existing.data, ...incoming.data]
                    : [...incoming.data, ...(existing.data || [])]
                  ,
                };
              },
            }
          }
        },
      }
    }),
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
