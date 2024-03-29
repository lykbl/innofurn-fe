import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Image from 'next/image';
import {
  ConversionTypes,
  PromotionBannerStyles,
  PromotionBannerTypeFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { PromotionBannerTypeQuery } from '@/gql/queries/promotion-banner';
import { useFragment } from '@/gql/generated';
import apolloClient from '@/lib/apollo/apollo-client';
import OutlinedLink from '@/(storefront)/components/outlined-link';

const FeaturedCarousel = async () => {
  const { data: carouselBannersQuery } = await apolloClient.getClient().query({
    query: PromotionBannerTypeQuery,
    variables: {
      handle: PromotionBannerStyles.CAROUSEL_ITEM,
      first: 10,
      page: 1,
      conversionType: ConversionTypes.PROMOTION_BANNER_CAROUSEL_ITEM,
    },
  });

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
      <CarouselContent className="border border-secondary p-2">
        {carouselItems.map((carouselItem) => (
          <CarouselItem className="basis-1/6" key={carouselItem.id}>
            {/*TODO Add promo banner page*/}
            <OutlinedLink href="/product/adde">
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
            </OutlinedLink>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default FeaturedCarousel;
