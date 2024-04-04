import { gql } from '@/gql/generated';
export const MyAddressesQuery = gql(/* GraphQL */ `
  query MyAddresses {
    myAddresses {
      ...AddressFragment
    }
  }
`);
