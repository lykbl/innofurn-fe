'use client';

import { HttpLink, from } from '@apollo/client';
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink,
} from '@apollo/experimental-nextjs-app-support/ssr';
import React from 'react';
import { cookieSet, getCookie } from '@/lib/utils';
import PusherLink from '@/lib/apollo/pusher-link';
import Pusher from 'pusher-js';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    console.log(
      'errorLink -> operation',
      graphQLErrors,
      networkError,
      operation,
    );
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err.extensions.code) {
          case 'UNAUTHENTICATED':
            //TODO verify this
            // const oldHeaders = operation.getContext().headers;
            // operation.setContext({
            //   headers: {
            //     ...oldHeaders,
            //     authorization: getNewToken(),
            //   },
            // });
            // Retry the request, returning the new observable
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
  credentials: 'include',
  preserveHeaderCase: true,
});

let csrfRequesting = false;
const asyncAuthLink = setContext(
  () =>
    new Promise(async (success, fail) => {
      if (!cookieSet('XSRF-TOKEN') && !csrfRequesting) {
        csrfRequesting = true;
        await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/sanctum/csrf-cookie`, {
          method: 'GET',
          credentials: 'include',
        });
      }

      const csrfCookie = getCookie('XSRF-TOKEN');
      csrfCookie
        ? success({
            headers: {
              'X-XSRF-TOKEN': decodeURIComponent(csrfCookie),
            },
          })
        : fail('No XSRF-TOKEN cookie');
    }),
);

function createClient() {
  const links = [];
  if (typeof window === 'undefined') {
    links.push(new SSRMultipartLink({ stripDefer: true }), httpLink);
  } else {
    const pusherLink = new PusherLink({
      pusher: new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY ?? '', {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER ?? 'eu',
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
      query: {
        // errorPolicy: 'ignore',
      },
      mutate: {
        errorPolicy: 'all',
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
            productDetails: {
              keyArgs: false,
            },
            searchProductReviews: {
              keyArgs: false,
              merge: (existing, incoming, { args }) => {
                if (!existing) return incoming;

                return {
                  __typename: existing.__typename,
                  data: [...existing.data, ...incoming.data],
                  paginatorInfo: incoming.paginatorInfo,
                };
              },
            },
          },
        },
        ProductVariant: {
          fields: {
            images: {
              keyArgs: false,
              merge: (existing, incoming, { args }) => {
                if (!existing) return incoming;

                return {
                  __typename: existing.__typename,
                  data: [...existing.data, ...incoming.data],
                  paginatorInfo: incoming.paginatorInfo,
                };
              },
            },
          },
        },
        Product: {
          fields: {
            reviews: {
              keyArgs: false,
              merge: (existing, incoming, { args }) => {
                console.log(existing, incoming);
                if (!existing) return incoming;

                return {
                  __typename: existing.__typename,
                  data: [...existing.data, ...incoming.data],
                  paginatorInfo: incoming.paginatorInfo,
                };
              },
            },
          },
        },
        Order: {
          fields: {
            productLines: {
              keyArgs: false,
            },
          },
        },
        ProductLinePaginator: {
          keyFields: false,
        },
        ReviewPaginator: {
          keyFields: false,
        },
        MediaPaginator: {
          keyFields: false,
        },
        ProductView: {
          keyFields: ['product', ['id']],
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
