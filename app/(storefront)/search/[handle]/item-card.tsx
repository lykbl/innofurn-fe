import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/common/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/common/button';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { FragmentType, useFragment } from '@/gql/generated';
import { ColorAttributeData, PriceData } from '@/gql/scalars';
import {
  DiscountFragmentFragmentDoc,
  ProductGridFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import FiveStars from '@/components/ui/common/five-stars';

export const Item = ({
  productFragment,
}: {
  productFragment: FragmentType<typeof ProductGridFragmentFragmentDoc>;
}) => {
  const product = useFragment(ProductGridFragmentFragmentDoc, productFragment);
  const [selectedProductVariant, setSelectedProductVariant] = React.useState(
    product.variants[0],
  );
  const averageRating = selectedProductVariant.averageRating || 0;
  const reviewsCount = selectedProductVariant.reviewsCount || 0;
  const isFavorite = selectedProductVariant.isFavorite;
  const isFeatured = selectedProductVariant.isFeatured;
  const onSale = false;
  const colorOptions = product.variants
    ?.map((variant) => {
      if (!variant.attributes?.color) {
        return;
      }

      return {
        variantId: variant.id,
        color: variant.attributes?.color,
      };
    })
    .filter((item): item is ColorOption => item !== undefined);
  const extraLabel = selectedProductVariant.attributes?.material?.en; //TODO specify lang
  const discounts = [
    ...product.discounts,
    ...selectedProductVariant.discounts,
  ].filter(
    (discount) =>
      !useFragment(DiscountFragmentFragmentDoc, discount).data.fixed_value,
  );
  const priceData = selectedProductVariant.prices?.[0].price;

  useEffect(() => {
    //TODO is this needed?
    setSelectedProductVariant(product.variants[0]);
  }, [product.variants]);

  const previewVariantColor = (variantId: number) => {
    const previewVariant = product.variants?.find(
      (variant) => variant.id === variantId,
    );
    if (previewVariant) {
      setSelectedProductVariant(previewVariant);
    }
  };

  return (
    <Card className="max-h flex flex-col">
      <CardHeader className="relative space-y-0 p-0">
        {isFeatured && (
          <Badge className="absolute left-0 top-0 bg-pink-600">New</Badge>
        )}
        {onSale && (
          <Badge className="absolute left-0 top-0 bg-emerald-600">Sale</Badge>
        )}
        <Image
          className="w-full rounded-t"
          width={225}
          height={225}
          alt={selectedProductVariant.images.data[0]?.name || 'Not found'}
          src={
            selectedProductVariant.images.data[0]?.originalUrl ||
            '/sample-kitchen-image-2.jpg'
          }
        />
      </CardHeader>
      <CardContent className="flex h-full flex-col justify-end bg-muted p-2">
        <ColorOptions
          values={colorOptions}
          previewVariantColor={previewVariantColor}
        />
        <p>{selectedProductVariant.name || product.name}</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiveStars
                averageRating={averageRating}
                reviewsCount={reviewsCount}
              />
            </TooltipTrigger>
            <TooltipContent></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Price priceData={priceData} discounts={discounts} />
      </CardContent>
      <CardFooter className="flex items-stretch bg-muted p-2">
        <ExtraBadge label={extraLabel} />
        <div className="ml-auto flex justify-end gap-1">
          <Button className="h-7 w-7 p-2">
            <Icons.heart className={cn(isFavorite ? 'fill-white' : '')} />
          </Button>
          <Button className="h-7 w-7 p-2">
            <Icons.cart />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const ExtraBadge = ({ label }: { label: string }) => {
  if (!label) {
    return;
  }

  return <Badge className="text-xs">{label}</Badge>;
};

const Price = ({
  priceData,
  discounts,
}: {
  priceData: PriceData;
  discounts: Array<FragmentType<typeof DiscountFragmentFragmentDoc>>;
}) => {
  const isOnSale = discounts.length > 0;
  const { format, value } = priceData;
  const bestDiscountAmount = calculateBestDiscountAmount(discounts, value);

  return (
    <div>
      {isOnSale && bestDiscountAmount ? (
        <div className="flex items-center gap-2">
          <span className="text-xl">{bestDiscountAmount.toFixed(2)}$</span>
          <p className="text-xs text-foreground/50 line-through">{format}</p>
        </div>
      ) : (
        <p className="text-xl">{format}</p>
      )}
    </div>
  );
};

const calculateBestDiscountAmount = (
  discounts: Array<FragmentType<typeof DiscountFragmentFragmentDoc>>,
  value: number,
): number => {
  if (!discounts.length) {
    return 0;
  }

  const bestDiscount = discounts.reduce((prev, current) =>
    applyDiscount(value, prev) < applyDiscount(value, current) ? prev : current,
  );

  return applyDiscount(value, bestDiscount) / 100;
};

type ColorOption = { variantId: number; color: ColorAttributeData };
const ColorOptions = ({
  values,
  previewVariantColor,
}: {
  values: Array<ColorOption>;
  previewVariantColor: (variantId: number) => void;
}) => {
  if (!values.length) {
    return;
  }

  return (
    <div className="flex justify-center gap-2 py-2">
      {values
        .sort((a, b) => a.color.label.localeCompare(b.color.label))
        .map(({ variantId, color: { label, value } }, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipContent>{label}</TooltipContent>
              <TooltipTrigger
                onMouseEnter={() => previewVariantColor(variantId)}
              >
                <span
                  style={{ backgroundColor: value }}
                  className="block h-4 w-4 rounded-full border border-solid border-black"
                />
              </TooltipTrigger>
            </Tooltip>
          </TooltipProvider>
        ))}
    </div>
  );
};

const applyDiscount = (
  price: number,
  discountFragment: FragmentType<typeof DiscountFragmentFragmentDoc>,
  // currency: 'USD' | 'EUR' = 'EUR',
) => {
  const discount = useFragment(DiscountFragmentFragmentDoc, discountFragment);
  // if (discount.data.fixed_value) {
  //   return price;
  // TODO add cart logic
  // const fixedAmountOff = Number(discount.data.fixed_values[currency]) * 100 || 0;
  //
  // return price - fixedAmountOff;
  // }

  const percentageOff = price * 0.01 * Number(discount.data.percentage); //TODO cast to number BE
  return price - percentageOff;
};
