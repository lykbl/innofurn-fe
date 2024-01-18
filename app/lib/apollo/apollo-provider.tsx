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

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        // Apollo Server sets code to UNAUTHENTICATED
        // when an AuthenticationError is thrown in a resolver
        case "UNAUTHENTICATED":
          // Modify the operation context with a new token
          // const oldHeaders = operation.getContext().headers;
          // operation.setContext({
            // headers: {
            //   ...oldHeaders,
            //   authorization: getNewToken(),
            // },
          // });
          // Retry the request, returning the new observable
          return forward(operation);
      }
    }
  }

  // To retry on network errors, we recommend the RetryLink
  // instead of the onError link. This just logs the error.
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  credentials: 'include',
  preserveHeaderCase: true,
});

// const authMiddleware = new ApolloLink((operation, forward) => {
//   // add the authorization to the headers
//   operation.setContext(({ headers = {} }) => ({
//     headers: {
//       ...headers,
//       'X-XSRF-TOKEN': decodeURIComponent(getCookie("XSRF-TOKEN") || ''),
//     }
//   }));
//   return forward(operation);
// });
// const retryLink = new RetryLink({
//   attempts: {
//     retryIf: (error, _operation) => {
//       console.log('retrying', error, _operation)
//
//       return !!error;
//     }
//   }
// });

let csrfRequesting = false; // TODO am i a hacker?
const asyncAuthLink = setContext(
  () => new Promise(async (success, fail) => {
    if (!cookieSet("XSRF-TOKEN") && !csrfRequesting) {
      csrfRequesting = true;
      await fetch('http://localhost/sanctum/csrf-cookie', {
        'method': 'GET',
        'credentials': 'include',
      })
    }

    const csrfCookie = getCookie("XSRF-TOKEN");
    csrfCookie ?
      success({
        headers: {
          'X-XSRF-TOKEN': decodeURIComponent(csrfCookie)
        }
      }) :
      fail('No XSRF-TOKEN cookie');
  }
));

function createClient() {
  const links = [];
  if (typeof window === 'undefined') {
    links.push(new SSRMultipartLink({stripDefer: true}), httpLink);
  } else {
    const pusherLink = new PusherLink({
      pusher: new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '', {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? 'eu',
        authEndpoint: process.env.NEXT_PUBLIC_SUBSCRIPTIONS_AUTH_ENDPOINT ?? 'http://localhost/graphql/subscriptions/auth',
        // auth: {
        //   headers: {},
        // },
      }),
    });
    links.push(asyncAuthLink, errorLink, pusherLink, httpLink);
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
              merge(existing = {}, incoming, { readField}) {
                //TODO better way to detect new messages?
                let isNewMessage = false;
                if (existing?.data && incoming?.data) {
                  const latestExistingId = readField('id', existing.data.slice(-1)[0]);
                  const newestIncomingId = readField('id', incoming.data[0]);
                  if (latestExistingId && newestIncomingId) {
                    isNewMessage = newestIncomingId > latestExistingId;
                  }
                }

                //TODO isolate this logic
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
        // Mutation: {
        //   fields: {
        //     //TODO separate logic?
        //     sendMessageToChatRoom: {
        //       read(existing, { readField }) {
        //         console.log('reding sending cache', existing)
        //       },
        //       merge(existing, incoming) {
        //         console.log('merging sending cache', existing, incoming)
        //       }
        //     }
        //   }
        // }
      }
    }),
  });
}

export const ApolloWrapper = ({ children }: React.PropsWithChildren) => (
  <ApolloNextAppProvider makeClient={ createClient }>
    { children }
  </ApolloNextAppProvider>
);