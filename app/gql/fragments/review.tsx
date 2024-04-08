import { gql } from '@/gql/generated';

const ReviewFragment = gql(/* GraphQL */ `
  fragment ReviewFragment on Review {
    id
    title
    body
    rating
    createdAt
    variant {
      id
      name
      product {
        defaultUrl {
          slug
        }
      }
      primaryImage {
        name
        conversions(types: [SMALL])
      }
    }
  }
`);
