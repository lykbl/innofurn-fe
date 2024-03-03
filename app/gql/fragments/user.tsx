import { gql } from '@/gql/generated';

const CheckMeFragment = gql(/* GraphQL */ `
  fragment CheckMeFragment on User {
    id
    email
    name
    customer {
      id
      fullName
      firstName
      lastName
      role
    }
  }
`);
