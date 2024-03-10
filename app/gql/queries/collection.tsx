import { gql } from '@/gql/generated';

export const RootCollectionsQuery = gql(/* GraphQL */ `
  query RootCollectionsQuery {
    rootCollections {
      ...RootCollectionFragment
    }
  }
`);
