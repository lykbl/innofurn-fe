import { gql } from '@/gql/generated';

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
