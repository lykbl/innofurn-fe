import { gql } from '@/gql/generated';

export const MyReviewsQuery = gql(/* GraphQL */ `
  query MyReviews($first: Int!, $page: Int!) {
    myReviews(first: $first, page: $page) {
      data {
        ...ReviewFragment
      }
      paginatorInfo {
        hasMorePages
        currentPage
      }
    }
  }
`);
