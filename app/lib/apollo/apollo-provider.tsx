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

// const wsLink = new GraphQLWsLink(createWsClient({
//   url: 'ws://localhost/subscriptions',
//   connectionParams: {
//     'X-XSRF-TOKEN': decodeURIComponent(getCookie("XSRF-TOKEN") || ''),
//   },
// }));

const splitLink = () => split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  // wsLink,
  httpLink,
)

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
              merge(existing = {}, incoming, extra) {
                //TODO better way to detect new messages?
                const isNewMessage = existing.paginatorInfo?.currentPage !== incoming.paginatorInfo?.currentPage;

                return {
                  paginatorInfo: incoming.paginatorInfo,
                  data: isNewMessage
                    ? [...incoming.data, ...(existing.data || [])]
                    : [...(existing.data || []), ...incoming.data]
                  ,
                };
              },
            }
          }
        }
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
