import { gql } from '@/gql/generated';

const RootCollectionFragment = gql(/* GraphQL */ `
  fragment RootCollectionFragment on Collection {
    id
    thumbnail {
      conversions(types: [PROMOTION_BANNER_CARD])
    }
    defaultUrl {
      slug
    }
  }
`);
