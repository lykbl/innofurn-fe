import { gql } from '@/gql/generated';

export const ADD_OR_UPDATE_PURCHASABLE = gql(/* GraphQL */ `
  mutation AddToCart($sku: String!, $quantity: Int!) {
    addOrUpdatePurchasable(sku: $sku, quantity: $quantity) {
      ...CartFragment
    }
  }
`);
