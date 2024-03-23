import Image from 'next/image';
import {
  ConversionTypes,
  PromotionBannerStyles,
  PromotionBannerTypeFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { PromotionBannerTypeQuery } from '@/gql/queries/promotion-banner';
import { useFragment } from '@/gql/generated';
import OutlinedLink from '@/(storefront)/components/outlined-link';
import apolloClient from '@/lib/apollo/apollo-client';

const FeaturedCards = async () => {
  const { data: cardBannersQuery } = await apolloClient.getClient().query({
    query: PromotionBannerTypeQuery,
    variables: {
      handle: PromotionBannerStyles.CARD,
      first: 4,
      page: 1,
      conversionType: ConversionTypes.PROMOTION_BANNER_CARD,
    },
  });

  if (!cardBannersQuery?.promotionBannerType) {
    return;
  }

  const promotionBannerType = useFragment(
    PromotionBannerTypeFragmentFragmentDoc,
    cardBannersQuery.promotionBannerType,
  );
  const cards = promotionBannerType.promotionBanners.data;

  return (
    <div className="flex w-full justify-between gap-1">
      {cards.map((card) => (
        <OutlinedLink href="/product/adde" key={card.id}>
          <Image
            src={
              card.bannerImage?.conversions[0] ||
              'https://via.placeholder.com/400x400.png/004466?text=fallback'
            }
            alt="alt"
            width={400}
            height={400}
            className="rounded"
          />
        </OutlinedLink>
      ))}
    </div>
  );
};

export default FeaturedCards;
