import { useSuspenseQuery } from '@apollo/client';
import { gql, useFragment } from '@/gql/generated';
import { Card } from '@/components/ui/common/card';
import { Separator } from '@/components/ui/common/separator';
import { SeparatorWithText } from '@/components/ui/common/separator-with-text';
import { Button } from '@/components/ui/common/button';
import { ProductLineFragmentFragmentDoc } from '@/gql/generated/graphql';
import { Icons } from '@/components/icons';
import BaseLink from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useTransition } from 'react';
import Image from 'next/image';

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
            primaryImage {
                conversions(types: [MEDIUM])
                name
            }
            product {
                defaultUrl {
                    id
                    slug
                }
            }
            sku
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

const OrderFragment = gql(/* GraphQL */ `
    fragment OrderFragment on Order {
        id
        status
        subTotal
        discountTotal
        shippingTotal
        taxTotal
        total
        placedAt
        productLines {
            data {
                ...ProductLineFragment
            }
            paginatorInfo {
                currentPage
                lastPage
                hasMorePages
                total
            }
        }
        shippingLines {
            ... ShippingLineFragment
        }
        billingAddress {
            ... OrderAddressFragment
        }
        shippingAddress {
            ... OrderAddressFragment
        }
    }
`);

export const MyOrdersQuery = gql(/* GraphQL */ `
    query MyOrders($page: Int!, $first: Int!) {
        myOrders(page: $page, first: $first) {
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

export default function OrdersList() {
  const { data: myOrdersQuery, fetchMore: fetchMoreOrders } = useSuspenseQuery(MyOrdersQuery, {
    variables: {
      page: 1,
      first: 5,
    },
  });
  const orders = myOrdersQuery?.myOrders.data.map((order) => (useFragment(OrderFragment, order)));
  const { hasMorePages: hasMoreOrders, currentPage: currentOrdersPage } = myOrdersQuery?.myOrders?.paginatorInfo;
  const [loadingMoreOrders, startLoadingMoreOrders] = useTransition();

  const handleLoadMoreOrders = () => {
    startLoadingMoreOrders(async () => {
      const response = await fetchMoreOrders({
        variables: {
          page: currentOrdersPage + 1,
          first: 5,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }

          return {
            myOrders: {
              ...fetchMoreResult.myOrders,
              data: [
                ...prev.myOrders.data,
                ...fetchMoreResult.myOrders.data,
              ],
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
      {orders.map((order) => {
        const productLines = order.productLines.data.map((line) => (useFragment(ProductLineFragmentFragmentDoc, line)));
        const { hasMorePages: hasMoreProductLines, total: linesTotal } = order.productLines.paginatorInfo;
        const shippingAddress = useFragment(OrderAddressFragment, order.shippingAddress);
        const billingAddress = useFragment(OrderAddressFragment, order.billingAddress);
        const shippingLines = order.shippingLines.map((shippingLineFragment) => useFragment(
          ShippingLineFragment,
          shippingLineFragment,
        ));

        return (
          <li>
            <Card className="flex flex-col gap-4 p-2">
              <div className="flex justify-between">
                <span>{order.id}</span>
                <Badge
                  className={cn(
                    order.status === 'payment-received' && 'bg-green-600',
                  )}
                >{order.status}</Badge>
              </div>
              <div className="flex flex-col gap-2">
                {productLines.map((productLine) => (
                  <div className="flex gap-2">
                    <Image
                      className="rounded-lg w-max border border-primary"
                      src={productLine.purchasable.primaryImage?.conversions[0] || '/fallback-image.jpg'}
                      alt={productLine.purchasable.primaryImage?.name || 'alt'}
                      width={100}
                      height={100}
                    />
                    <div className="flex justify-between w-full">
                      <div className="flex flex-col">
                        <Button
                          asChild
                          variant="link"
                          size="link"
                          className="text-xl"
                        >
                          <BaseLink
                            href={`/product/${productLine.purchasable.product.defaultUrl.slug}`}
                          >
                            {productLine.purchasable.name}
                          </BaseLink>
                        </Button>
                        <p className="text-secondary pb-4">
                          SKU: {productLine.purchasable.sku}
                        </p>
                          <Button size="default">
                              Leave a review for product
                          </Button>
                      </div>
                      <div className="flex justify-between w-1/4">
                        <span>{productLine.unitQuantity} pcs.</span>
                        <span>{productLine.unitPrice.format}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {false && hasMoreProductLines && (
                  <div className="flex flex-col gap-2 items-center">
                    <SeparatorWithText
                      className="font-semibold"
                    >
                      An additional {linesTotal - productLines.length} products are hidden
                    </SeparatorWithText>
                    <Button
                      variant="outline"
                      className="w-max"
                    >
                      Show all lines
                    </Button>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <div className="flex flex-col w-1/3">
                    <p className="flex flex-col">
                        <span className="font-semibold">
                           Delivery to:
                        </span>
                      <span>
                          {shippingAddress.city} {shippingAddress.country.name} {shippingAddress.lineOne}
                       </span>
                    </p>
                    <div className="pt-4 *:justify-between *:flex">
                      <p>
                        <span>
                            Contact Email:
                        </span>
                        <span>
                      {shippingAddress.contactEmail}
                        </span>
                      </p>
                      <p>
                        <span>Contact Phone:</span>
                        <span>{shippingAddress.contactPhone}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col w-1/3 justify-between *:flex *:justify-between">
                    <div className="flex flex-col *:flex *:justify-between">
                      <p>
                        <span>Subtotal:</span>
                        <span>{order.subTotal.format}</span>
                      </p>
                      <p>
                        <span>Delivery:</span>
                        <span>{shippingLines[0].total.format}</span>
                      </p>
                    </div>
                    <p className="pt-4 font-semibold">
                      <span>Total:</span>
                      <span>{order.total.format}</span>
                    </p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {/*<Button variant="default">*/}
                  {/*  Leave a review*/}
                  {/*</Button>*/}
                  <Button
                    asChild
                    variant="outline"
                  >
                    <BaseLink href="/orders/1">
                      Order details
                    </BaseLink>
                  </Button>
                </div>
              </div>
              <div className="p-2 hidden">
                <Card className="flex bg-muted flex-col gap-4 p-2">
                  <div className="flex flex-col gap-2">
                    {shippingLines.map((shippingLine) => (
                      <div className="flex justify-between">
                        <div className="flex gap-2">
                            <span>
                                <Icons.truck />
                            </span>
                          <span>
                                {shippingLine.description}
                            </span>
                          <span>
                                {shippingLine.identifier}
                            </span>
                        </div>
                        <div>
                          {shippingLine.total.format}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <div className="w-1/3">
                      <p className="font-semibold">Delivery Instructions:</p>
                      <p>{shippingAddress.deliveryInstructions}</p>
                    </div>
                    <div className="flex flex-col gap-2 w-1/3 *:flex *:justify-between">
                      <p>
                        <span>Sub Total:</span>
                        <span>{order.subTotal.format}</span>
                      </p>
                      <p className="text-destructive">
                        <span>Discount Total:</span>
                        <span>-{order.discountTotal.format}</span>
                      </p>
                      <p>
                        <span>Shipping Total:</span>
                        <span>{order.shippingTotal.format}</span>
                      </p>
                      <p>
                        <span>VAT:</span>
                        <span>{order.taxTotal.format}</span>
                      </p>
                      <p className="font-semibold">
                        <span>Total:</span>
                        <span>{order.total.format}</span>
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </Card>
          </li>
        );
      })}
      {hasMoreOrders && (
        <Button
          onClick={handleLoadMoreOrders}
          disabled={loadingMoreOrders}
        >
          Load more orders
        </Button>
      )}
    </ul>
  );
}
