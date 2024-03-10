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

const FeaturedPanelSkeleton = () => {
  return (
    <OutlinedLink href="/404" className="flex animate-pulse">
      <Image
        src={'https://via.placeholder.com/1600x300.png/004466?text=fallback'}
        alt="test"
        width={1600}
        height={300}
        className="rounded"
      />
    </OutlinedLink>
  );
};

export default FeaturedPanelSkeleton;
