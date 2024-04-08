import { gql } from '@/gql/generated';

export const CreateReviewMutation = gql(`
  mutation CreateReviewMutation($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      title
      body
      rating
    }
  }
`);
