import { Stars } from '@/(storefront)/product/[slug]/rating';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { Button } from '@/components/ui/common/button';
import { ProductReviewFragmentFragment } from '@/gql/generated/graphql';

export default function ReviewRow({
  review,
}: {
  review: ProductReviewFragmentFragment;
}) {
  return (
    <div className="mb-4 flex flex-col gap-1 border-b border-black py-2 text-sm font-medium">
      <div className="mb-2 flex items-center gap-1">
        <span className="h-[25px] w-[25px] rounded-full bg-gray-500" />
        <span className="text-md">{review.customer.fullName}</span>
      </div>
      <div className="flex items-center gap-1">
        <Stars size={16} />
      </div>
      <h4 className="text-lg font-semibold">{review.title}</h4>
      <p>
        <span>Color: Blue</span>
        <span className="ml-2 border-l border-black pl-2 text-green-500">
          Verified purchase
        </span>
      </p>
      <p>{review.body}</p>
      <p className="flex gap-2 text-gray-500">
        <span>Reviewed on {review.createdAt}</span>
      </p>
      <div className="py-2">
        <Carousel>
          <CarouselContent>
            {Array(10)
              .fill(null)
              .map((_, index) => (
                <CarouselItem>
                  <Image
                    key={index}
                    className="min-w-[100px] rounded"
                    width={100}
                    height={100}
                    src="/fallback-image.jpg"
                    alt="customer pohoto"
                  />
                </CarouselItem>
              ))}
          </CarouselContent>
        </Carousel>
      </div>
      <div className="mt-2 flex gap-2">
        <Button>Helpful</Button>
        <Button>Report</Button>
      </div>
    </div>
  );
}
