import { gql } from '@/gql/generated';

const OrderAddressFragment = gql(/* GraphQL */ `
  fragment OrderAddressFragment on OrderAddress {
    id
    country {
      id
      name
    }
    firstName
    lastName
    companyName
    lineOne
    lineTwo
    lineThree
    city
    state
    postcode
    deliveryInstructions
    contactEmail
    contactPhone
    type
  }
`);

const ShippingLineFragment = gql(/* GraphQL */ `
  fragment ShippingLineFragment on ShippingLine {
    id
    description
    identifier
    total
  }
`);

const ProductLineFragment = gql(/* GraphQL */ `
  fragment ProductLineFragment on ProductLine {
    id
    purchasable {
      id
      name
      sku
      primaryImage {
        id
        conversions(types: [MEDIUM])
        name
      }
      product {
        id
        defaultUrl {
          id
          slug
        }
      }
    }
    type
    description
    option
    identifier
    unitPrice
    unitQuantity
    quantity
    subTotal
    discountTotal
    taxTotal
    total
  }
`);

export const OrderFragment = gql(/* GraphQL */ `
  fragment OrderFragment on Order {
    id
    status
    subTotal
    discountTotal
    shippingTotal
    taxTotal
    total
    placedAt
    productLines(first: $firstProductLines) {
      data {
        ...ProductLineFragment
      }
      paginatorInfo {
        currentPage
        hasMorePages
        total
      }
    }
    shippingLines {
      ...ShippingLineFragment
    }
    billingAddress {
      ...OrderAddressFragment
    }
    shippingAddress {
      ...OrderAddressFragment
    }
  }
`);
