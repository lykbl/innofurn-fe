import { gql } from '@/gql/generated';

const CheckMeFragment = gql(/* GraphQL */ `
  fragment CheckMeFragment on User {
    id
    email
    name
    emailVerifiedAt
    customer {
      id
      fullName
      firstName
      lastName
      role
      title
    }
  }
`);
