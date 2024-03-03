import { gql } from '@/gql/generated';

export const MyCartQuery = gql(/* GraphQL */ `
  query MyCart {
    myCart {
      ...CartFragment
    }
  }
`);

export const ClearCartMutation = gql(/* GraphQL */ `
  mutation ClearItem($sku: String!) {
    clearCartItem(sku: $sku) {
      ...CartFragment
    }
  }
`);
