import { ReviewFragmentFragment } from '@/gql/generated/graphql';
import { Card } from '@/components/ui/common/card';
import { Button } from '@/components/ui/common/button';

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
          className="w-[160px] rounded-lg border border-primary"
          src={
            review.variant.primaryImage?.conversions[0] || '/fallback-image.jpg'
          }
          alt={review.variant.primaryImage?.name || 'No image loaded'}
          width={160}
          height={160}
        />
        <div className="flex flex-col gap-2">
          <Button asChild variant="link" size="link" className="text-2xl">
            <BaseLink
              href={`/product/${review.variant.product.defaultUrl.slug}`}
            >
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
