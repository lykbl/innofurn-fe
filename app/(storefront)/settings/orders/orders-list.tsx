import { useSuspenseQuery } from '@apollo/client';
import { useFragment } from '@/gql/generated';
import { Button } from '@/components/ui/common/button';
import { OrderFragmentFragmentDoc } from '@/gql/generated/graphql';
import { cn } from '@/lib/utils';
import { useTransition } from 'react';
import { MyOrdersQuery } from '@/gql/queries/order';
import OrderLine from '@/components/order/order-line';

const MINIMUM_VISIBLE_PRODUCTS_LINES = 3;

export default function OrdersList() {
  const { data: myOrdersQuery, fetchMore: fetchMoreOrders } = useSuspenseQuery(
    MyOrdersQuery,
    {
      variables: {
        page: 1,
        first: 5,
        firstProductLines: MINIMUM_VISIBLE_PRODUCTS_LINES,
      },
    },
  );
  const orders = myOrdersQuery?.myOrders.data.map((order) =>
    useFragment(OrderFragmentFragmentDoc, order),
  );
  const { hasMorePages: hasMoreOrders, currentPage: currentOrdersPage } =
    myOrdersQuery?.myOrders?.paginatorInfo;
  const [loadingMoreOrders, startLoadingMoreOrders] = useTransition();

  const handleLoadMoreOrders = () => {
    startLoadingMoreOrders(async () => {
      await fetchMoreOrders({
        variables: {
          page: currentOrdersPage + 1,
          first: 5,
          firstProductLines: MINIMUM_VISIBLE_PRODUCTS_LINES,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }

          return {
            myOrders: {
              ...fetchMoreResult.myOrders,
              data: [...prev.myOrders.data, ...fetchMoreResult.myOrders.data],
            },
          };
        },
      });
    });
  };

  return (
    <ul
      className={cn(
        'flex flex-col gap-2',
        loadingMoreOrders && 'animate-pulse',
      )}
    >
      {orders.map((order) => (
        <OrderLine
          order={order}
          key={order.id}
          minimumVisibleProductLines={MINIMUM_VISIBLE_PRODUCTS_LINES}
        />
      ))}
      {hasMoreOrders && (
        <Button onClick={handleLoadMoreOrders} disabled={loadingMoreOrders}>
          Load more orders
        </Button>
      )}
    </ul>
  );
}
