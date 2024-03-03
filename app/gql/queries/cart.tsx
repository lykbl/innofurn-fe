import { gql } from '@/gql/generated';

export const CART_QUERY = gql(/* GraphQL */ `
  query MyCart {
    myCart {
      ...CartFragment
    }
  }
`);

export const CLEAR_CART_MUTATION = gql(/* GraphQL */ `
  mutation ClearItem($sku: String!) {
    clearCartItem(sku: $sku) {
      ...CartFragment
    }
  }
`);
