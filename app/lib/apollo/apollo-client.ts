import { from, gql, HttpLink } from '@apollo/client';
import {
  NextSSRInMemoryCache,
  NextSSRApolloClient,
} from '@apollo/experimental-nextjs-app-support/ssr';
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc';
import { onError } from '@apollo/client/link/error';
import { createFragmentRegistry } from '@apollo/client/cache';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    // console.log("GraphQL Errors", graphQLErrors);
  }
  if (networkError) {
    // console.log("Network Errors", networkError);
  }
});

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
});

const linkCombinator = from([httpLink]); //TODO add error hadling link

const apolloClient = registerApolloClient(() => {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache({
      // fragments: createFragmentRegistry(gql`
      //     fragment RootCollectionFragment on Collection {
      //         id
      //         thumbnail {
      //             conversions(types: [PROMOTION_BANNER_CARD])
      //         }
      //         defaultUrl {
      //             slug
      //         }
      //     }
      // `),
    }),
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
