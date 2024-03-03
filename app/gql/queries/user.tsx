import { gql } from '@/gql/generated';

export const CheckMeQuery = gql(/* GraphQL */ `
  query CheckMe {
    checkMe {
      ...CheckMeFragment
    }
  }
`);
