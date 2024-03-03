import { gql } from '@/gql/generated';

export const COUNTRIES_QUERY = gql(/* GraphQL */ `
  query countries {
    countries {
      ...CountryFragment
    }
  }
`);
