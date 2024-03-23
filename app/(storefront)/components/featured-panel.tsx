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

const CACHE_MINUTES = 60 * 5;
const FeaturedPanel = async () => {
  const { data: cardBannersQuery } = await apolloClient.getClient().query({
    query: PromotionBannerTypeQuery,
    variables: {
      handle: PromotionBannerStyles.PANEL,
      first: 1,
      page: 1,
      conversionType: ConversionTypes.PROMOTION_BANNER_PANEL,
    },
    context: {
      fetchOptions: {
        next: { revalidate: CACHE_MINUTES },
      },
    },
  });

  if (!cardBannersQuery?.promotionBannerType) {
    return;
  }

  const promotionBannerType = useFragment(
    PromotionBannerTypeFragmentFragmentDoc,
    cardBannersQuery.promotionBannerType,
  );
  const panel = promotionBannerType.promotionBanners.data[0];

  return (
    <OutlinedLink href="/product/adde" className="flex w-full">
      <Image
        src={
          panel.bannerImage?.conversions[0] ||
          'https://via.placeholder.com/1600x300.png/004466?text=fallback'
        }
        alt="test"
        width={1600}
        height={300}
        className="w-full rounded"
      />
    </OutlinedLink>
  );
};

export default FeaturedPanel;
