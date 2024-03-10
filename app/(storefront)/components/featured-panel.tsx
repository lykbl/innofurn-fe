'use client';

import Image from 'next/image';
import { useQuery, useSuspenseQuery } from '@apollo/client';
import {
  ConversionTypes,
  PromotionBannerStyles,
  PromotionBannerTypeFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { PromotionBannerTypeQuery } from '@/gql/queries/promotion-banner';
import { useFragment } from '@/gql/generated';
import OutlinedLink from '@/(storefront)/components/outlined-link';

const FeaturedPanel = () => {
  const { data: cardBannersQuery } = useSuspenseQuery(
    PromotionBannerTypeQuery,
    {
      variables: {
        handle: PromotionBannerStyles.PANEL,
        first: 1,
        page: 1,
        conversionType: ConversionTypes.PROMOTION_BANNER_PANEL,
      },
    },
  );

  if (!cardBannersQuery?.promotionBannerType) {
    return;
  }

  const promotionBannerType = useFragment(
    PromotionBannerTypeFragmentFragmentDoc,
    cardBannersQuery.promotionBannerType,
  );
  const panel = promotionBannerType.promotionBanners.data[0];

  return (
    <OutlinedLink href="/product/adde" className="flex">
      <Image
        src={
          panel.bannerImage?.conversions[0] ||
          'https://via.placeholder.com/1600x300.png/004466?text=fallback'
        }
        alt="test"
        width={1600}
        height={300}
        className="rounded"
      />
    </OutlinedLink>
  );
};

export default FeaturedPanel;
