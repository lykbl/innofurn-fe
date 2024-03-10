'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useSuspenseQuery } from '@apollo/client';
import {
  ConversionTypes,
  PromotionBannerStyles,
  PromotionBannerTypeFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { PromotionBannerTypeQuery } from '@/gql/queries/promotion-banner';
import { useFragment } from '@/gql/generated';

const FeaturedCarousel = () => {
  const { data: carouselBannersQuery } = useSuspenseQuery(
    PromotionBannerTypeQuery,
    {
      variables: {
        handle: PromotionBannerStyles.CAROUSEL_ITEM,
        first: 10,
        page: 1,
        conversionType: ConversionTypes.PROMOTION_BANNER_CAROUSEL_ITEM,
      },
    },
  );

  if (!carouselBannersQuery?.promotionBannerType) {
    return;
  }

  const promotionBannerType = useFragment(
    PromotionBannerTypeFragmentFragmentDoc,
    carouselBannersQuery.promotionBannerType,
  );
  const carouselItems = promotionBannerType.promotionBanners.data;

  return (
    <Carousel>
      <CarouselContent className="p-2">
        {carouselItems.map((carouselItem) => (
          <CarouselItem className="basis-1/6" key={carouselItem.id}>
            <div className="rounded outline-1 outline-offset-4 outline-primary hover:outline">
              <Link href="/product/adde">
                <Image
                  src={
                    carouselItem.bannerImage?.conversions[0] ||
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

export default FeaturedCarousel;
