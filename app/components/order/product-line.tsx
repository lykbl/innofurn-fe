import Image from 'next/image';
import { Button } from '@/components/ui/common/button';
import BaseLink from 'next/link';
import { ProductLineFragmentFragment } from '@/gql/generated/graphql';

export default function ProductLine({
 productLine
} : {
 productLine: ProductLineFragmentFragment
}) {
  return (
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
          <p className="pb-4">
            SKU: {productLine.purchasable.sku}
          </p>
          <Button size="default">
            Leave a review
          </Button>
        </div>
        <div className="flex justify-between w-1/4">
          <span>{productLine.unitQuantity} pcs.</span>
          <span>{productLine.unitPrice.format}</span>
        </div>
      </div>
    </div>
  );
}
