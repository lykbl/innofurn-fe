import {
  OrderAddressFragmentFragmentDoc,
  OrderFragmentFragment,
  ProductLineFragmentFragmentDoc,
  ShippingLineFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { useFragment } from '@/gql/generated';
import { Card } from '@/components/ui/common/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/common/button';
import { SeparatorWithText } from '@/components/ui/common/separator-with-text';
import { Separator } from '@/components/ui/common/separator';
import { Icons } from '@/components/icons';
import ProductLine from '@/components/order/product-line';
import { useLazyQuery } from '@apollo/client';
import { OrderDetailsQuery } from '@/gql/queries/order';
import { useToast } from '@/components/ui/use-toast';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function OrderLine({
  order,
  minimumVisibleProductLines,
}: {
  order: OrderFragmentFragment;
  minimumVisibleProductLines: number;
}) {
  const productLines = order.productLines.data.map((line) =>
    useFragment(ProductLineFragmentFragmentDoc, line),
  );
  const { hasMorePages: hasMoreProductLines, total: linesTotal } =
    order.productLines.paginatorInfo;
  const shippingAddress = useFragment(
    OrderAddressFragmentFragmentDoc,
    order.shippingAddress,
  );
  const shippingLines = order.shippingLines.map((shippingLineFragment) =>
    useFragment(ShippingLineFragmentFragmentDoc, shippingLineFragment),
  );
  const { toast } = useToast();

  const [fetchAllProductLines, { client }] = useLazyQuery(OrderDetailsQuery);
  const handleLoadAllProductLines = async () => {
    const response = await fetchAllProductLines({
      variables: {
        id: order.id,
        firstProductLines: linesTotal,
      },
    });

    if (response.error) {
      toast({
        title: 'Error',
        type: 'foreground',
        duration: 3000,
        description: 'There was an error fetching all products',
        variant: 'destructive',
      });
      return;
    }

    const newProductLines = response.data?.orderDetails.productLines;
    if (newProductLines) {
      client.cache.modify({
        id: `Order:${order.id}`,
        fields: {
          productLines: () => newProductLines,
        },
      });
    }
  };

  return (
    <li>
      <Card className="flex flex-col gap-4 p-2">
        <div className="flex justify-between">
          <span className="text-xl font-semibold">#{order.id}</span>
          <Badge
            variant={
              (cn(
                order.status === 'payment-received' && 'success',
                order.status === 'awaiting-payment' && 'pending',
                order.status === 'failed' && 'destructive',
              ) as 'destructive') ||
              'pending' ||
              'success'
            }
            //TODO actually type this
          >
            {order.status}
          </Badge>
        </div>
        <div className="">
          <div className="flex flex-col gap-2 pb-2">
            {productLines
              .slice(0, minimumVisibleProductLines)
              .map((productLine) => (
                <ProductLine productLine={productLine} />
              ))}
          </div>
          {minimumVisibleProductLines < productLines.length && (
            <Collapsible
              defaultOpen={true}
              className={cn(
                'flex flex-col gap-2 data-[state=open]:flex-row data-[state=open]:gap-0',
              )}
            >
              <CollapsibleContent
                //TODO why is animation triggering twice?
                // className="flex flex-col gap-2 overflow-hidden transition-all data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up"
                className="flex min-w-[100%] flex-col gap-2"
              >
                {productLines
                  .slice(minimumVisibleProductLines)
                  .map((productLine) => (
                    <ProductLine productLine={productLine} />
                  ))}
              </CollapsibleContent>
              <CollapsibleTrigger
                className={cn(
                  'data-[state=open]:sticky data-[state=open]:top-2 data-[state=open]:min-w-max data-[state=open]:translate-x-4',
                )}
                asChild
              >
                <Button>Show all items</Button>
              </CollapsibleTrigger>
            </Collapsible>
          )}
          {hasMoreProductLines && (
            <div className="flex flex-col items-center gap-2">
              <SeparatorWithText className="font-semibold">
                {linesTotal - productLines.length} products are hidden
              </SeparatorWithText>
              {
                <Button
                  variant="outline"
                  className="w-max"
                  onClick={handleLoadAllProductLines}
                >
                  Show all products
                </Button>
              }
            </div>
          )}
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <div className="flex w-1/3 flex-col">
              <p className="flex flex-col">
                <span className="font-semibold">Delivery to:</span>
                <span>
                  {shippingAddress.city} {shippingAddress.country.name}{' '}
                  {shippingAddress.lineOne}
                </span>
              </p>
              <div className="pt-4 *:flex *:justify-between">
                <p>
                  <span>Contact Email:</span>
                  <span>{shippingAddress.contactEmail}</span>
                </p>
                <p>
                  <span>Contact Phone:</span>
                  <span>{shippingAddress.contactPhone}</span>
                </p>
              </div>
            </div>
            <div className="flex w-1/3 flex-col justify-between *:flex *:justify-between">
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
          {/*<div className="flex justify-end gap-2">*/}
          {/*  <Button*/}
          {/*    asChild*/}
          {/*    variant="outline"*/}
          {/*  >*/}
          {/*    <BaseLink href="/orders/1">*/}
          {/*      Order details*/}
          {/*    </BaseLink>*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </div>
        <div className="hidden p-2">
          <Card className="flex flex-col gap-4 bg-muted p-2">
            <div className="flex flex-col gap-2">
              {shippingLines.map((shippingLine) => (
                <div className="flex justify-between">
                  <div className="flex gap-2">
                    <span>
                      <Icons.truck />
                    </span>
                    <span>{shippingLine.description}</span>
                    <span>{shippingLine.identifier}</span>
                  </div>
                  <div>{shippingLine.total.format}</div>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between">
              <div className="w-1/3">
                <p className="font-semibold">Delivery Instructions:</p>
                <p>{shippingAddress.deliveryInstructions}</p>
              </div>
              <div className="flex w-1/3 flex-col gap-2 *:flex *:justify-between">
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
}
