'use client';

import Image from 'next/image';
import { useQuery } from '@apollo/client';
import {
  PromotionBannerStyles,
  PromotionBannerTypeFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { PromotionBannerTypeQuery } from '@/gql/queries/promotion-banner';
import { useFragment } from '@/gql/generated';
import OutlinedLink from '@/(storefront)/components/outlined-link';

const FeaturedPanel = () => {
  const { data: cardBannersQuery } = useQuery(PromotionBannerTypeQuery, {
    variables: {
      handle: PromotionBannerStyles.PANEL,
      first: 1,
      page: 1,
    },
  });

  if (!cardBannersQuery?.promotionBannerType) {
    return 'loading';
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
          panel.bannerImage?.originalUrl ||
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
