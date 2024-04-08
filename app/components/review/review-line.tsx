import {
  OrderAddressFragmentFragmentDoc,
  OrderFragmentFragment,
  ProductLineFragmentFragmentDoc, ProductReviewFragmentFragment, ReviewFragmentFragment,
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
import Image from 'next/image';
import FiveStars from '@/components/ui/common/five-stars';
import BaseLink from 'next/link';

export default function ReviewLine({
  review,
}: {
  review: ReviewFragmentFragment;
}) {
  return (
    <li>
      <Card className="flex gap-2 p-2">
         <Image
           className="border border-primary rounded-lg w-[160px]"
           src={review.variant.primaryImage?.conversions[0] || '/fallback-image.jpg'}
           alt={review.variant.primaryImage?.name || 'No image loaded'}
           width={160}
           height={160}
         />
        <div className="flex flex-col gap-2">
          <Button asChild variant="link" size="link" className="text-2xl">
            <BaseLink href={`/product/${review.variant.product.defaultUrl.slug}`}>
              {review.variant.name}
            </BaseLink>
          </Button>
          <h3>{review.title}</h3>
          <p>{review.body}</p>
          <FiveStars rating={review.rating} />
          <p>Submitted on {new Date(review.createdAt).toLocaleDateString()}</p>
        </div>
      </Card>
    </li>
  );
}
