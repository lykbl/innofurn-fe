import { gql } from '@/gql/generated';

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

// export const CART_QUERY = gql(/* GraphQL */ `
//     query MyCart {
//         myCart {
//             ...CartFragment
//         }
//     }
// `);
//
// const CartFragment = gql(/* GraphQL */ `
//     fragment CartFragment on Cart {
//         id
//         total
//         taxTotal
//         discountTotal
//         lines {
//             ...CartLineFragment
//         }
//     }
// `);
