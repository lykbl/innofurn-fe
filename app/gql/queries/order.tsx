import { gql } from '@/gql/generated';

export const MyOrdersQuery = gql(/* GraphQL */ `
  query MyOrders($page: Int!, $first: Int!, $firstProductLines: Int!) {
    myOrders(
      page: $page
      first: $first
      firstProductLines: $firstProductLines
    ) {
      data {
        ...OrderFragment
      }
      paginatorInfo {
        currentPage
        hasMorePages
        total
      }
    }
  }
`);

export const OrderDetailsQuery = gql(/* GraphQL */ `
  query OrderDetailsQuery($id: IntID!, $firstProductLines: Int!) {
    orderDetails(id: $id, firstProductLines: $firstProductLines) {
      productLines(first: $firstProductLines) {
        data {
          ...ProductLineFragment
        }
        paginatorInfo {
          hasMorePages
          currentPage
          total
        }
      }
    }
  }
`);
