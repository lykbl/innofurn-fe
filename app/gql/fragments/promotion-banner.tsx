import { gql } from '@/gql/generated';

const PromotionBannerTypeFragment = gql(/* GraphQL */ `
  fragment PromotionBannerTypeFragment on PromotionBannerType {
    id
    promotionBanners(first: $first, page: $page) {
      data {
        id
        bannerImage {
          id
          conversions(types: [$conversionType])
        }
      }
    }
  }
`);
