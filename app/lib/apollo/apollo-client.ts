import { from, HttpLink } from '@apollo/client';
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log('GraphQL Errors', graphQLErrors);
  }
  if (networkError) {
    console.log('Network Errors', networkError);
  }
});

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

const linkCombinator = from([errorLink, httpLink]); //TODO add error hadling link

const apolloClient = registerApolloClient(() => {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link: linkCombinator,
    defaultOptions: {
      query: {
        // errorPolicy: 'none',
      },
      mutate: {
        // errorPolicy: 'ignore',
      },
    },
  });
});

export default apolloClient;
