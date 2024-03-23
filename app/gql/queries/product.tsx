import { gql } from '@/gql/generated';

export const ProductDetailsQuery = gql(/* GraphQL */ `
  query ProductDetails($slug: String!, $imagesPage: Int!) {
    productDetails(slug: $slug) {
      ...ProductDetailsFragment
    }
  }
`);

export const UserReviewsQuery = gql(/* GraphQL */ `
  query UserReviews {
    userReviews {
      id
      title
      body
    }
  }
`);
