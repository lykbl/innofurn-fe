import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Link from 'next/link';
import Image from 'next/image';

const FeaturedCarouselSkeleton = () => {
  return (
    <Carousel>
      <CarouselContent className="animate-pulse p-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <CarouselItem className="basis-1/6" key={i}>
            <div className="rounded outline-1 outline-offset-4 outline-primary hover:outline">
              <Link href="/404">
                <Image
                  src={
                    'https://via.placeholder.com/250x150.png/004466?text=fallback'
                  }
                  alt="alt"
                  width={250}
                  height={150}
                  className="rounded"
                />
              </Link>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default FeaturedCarouselSkeleton;
