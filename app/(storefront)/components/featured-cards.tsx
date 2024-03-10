'use client';

import Image from 'next/image';
import { useQuery } from '@apollo/client';
import {
  ConversionTypes,
  PromotionBannerStyles,
  PromotionBannerTypeFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { PromotionBannerTypeQuery } from '@/gql/queries/promotion-banner';
import { useFragment } from '@/gql/generated';
import OutlinedLink from '@/(storefront)/components/outlined-link';

const FeaturedCards = () => {
  const { data: cardBannersQuery } = useQuery(PromotionBannerTypeQuery, {
    variables: {
      handle: PromotionBannerStyles.CARD,
      first: 4,
      page: 1,
      conversionType: ConversionTypes.PROMOTION_BANNER_CARD,
    },
  });

  if (!cardBannersQuery?.promotionBannerType) {
    return 'loading';
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
