import Image from 'next/image';
import { Button } from '@/components/ui/common/button';
import BaseLink from 'next/link';
import { ProductLineFragmentFragment } from '@/gql/generated/graphql';

export default function ProductLine({
  productLine,
}: {
  productLine: ProductLineFragmentFragment;
}) {
  return (
    <div className="flex gap-2">
      <Image
        className="w-max rounded-lg border border-primary"
        src={
          productLine.purchasable.primaryImage?.conversions[0] ||
          '/fallback-image.jpg'
        }
        alt={productLine.purchasable.primaryImage?.name || 'alt'}
        width={100}
        height={100}
      />
      <div className="flex w-full justify-between">
        <div className="flex flex-col">
          <Button asChild variant="link" size="link" className="text-xl">
            <BaseLink
              href={`/product/${productLine.purchasable.product.defaultUrl.slug}`}
            >
              {productLine.purchasable.name}
            </BaseLink>
          </Button>
          <p className="pb-4">SKU: {productLine.purchasable.sku}</p>
          <Button size="default">Leave a review</Button>
        </div>
        <div className="flex w-1/4 justify-between">
          <span>{productLine.unitQuantity} pcs.</span>
          <span>{productLine.unitPrice.format}</span>
        </div>
      </div>
    </div>
  );
}
