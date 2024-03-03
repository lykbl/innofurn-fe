import { gql } from '@/gql/generated';

//TODO reuse other fragments?
const AddressFragment = gql(/* GraphQL */ `
  fragment AddressFragment on Address {
    id
    title
    firstName
    lastName
    companyName
    lineOne
    lineTwo
    lineThree
    city
    state
    postcode
    country {
      id
      name
    }
    deliveryInstructions
    contactEmail
    contactPhone
    billingDefault
    shippingDefault
  }
`);
