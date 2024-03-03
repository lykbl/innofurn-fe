import { gql } from '@/gql/generated';

const CountryFragment = gql(/* GraphQL */ `
  fragment CountryFragment on Country {
    id
    name
    iso3
    iso2
    phoneCode
  }
`);
