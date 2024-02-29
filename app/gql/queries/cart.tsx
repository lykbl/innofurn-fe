import { gql } from '@/gql/generated';

export const CART_QUERY = gql(/* GraphQL */ `
  query MyCart {
    myCart {
      ...CartFragment
    }
  }
`);

const CartFragment = gql(/* GraphQL */ `
  fragment CartFragment on Cart {
    id
    total
    taxTotal
    discountTotal
    lines {
      ...CartLineFragment
    }
  }
`);

const DiscountBreakdownFragment = gql(/* GraphQL */ `
  fragment DiscountBreakdownFragment on DiscountBreakdown {
    discount {
      data
    }
    price
    lines {
      line {
        id
      }
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

const CartLineFragment = gql(/* GraphQL */ `
  fragment CartLineFragment on CartLine {
    id
    quantity
    subTotal
    discountTotal
    subTotalDiscounted
    purchasable {
      id
      name
      sku
      reviewsCount
      averageRating
      product {
        id
        brand {
          id
          name
          defaultUrl {
            slug
          }
        }
      }
      primaryImage {
        id
        originalUrl
        name
      }
      prices {
        id
        price
      }
      values {
        name
      }
    }
  }
`);
