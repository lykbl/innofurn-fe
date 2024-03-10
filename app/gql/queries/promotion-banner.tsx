import { gql } from '@/gql/generated';

export const PromotionBannerTypeQuery = gql(/* GraphQL */ `
  query PromotionBannerType(
    $handle: PromotionBannerStyles!
    $first: Int!
    $page: Int!
  ) {
    promotionBannerType(handle: $handle, first: $first, page: $page) {
      ...PromotionBannerTypeFragment
    }
  }
`);

const PromotionBannerTypeFragment = gql(/* GraphQL */ `
  fragment PromotionBannerTypeFragment on PromotionBannerType {
    id
    promotionBanners(first: $first, page: $page) {
      data {
        id
        primaryImage {
          originalUrl
          conversions
          id
        }
        bannerImage {
          originalUrl
          id
        }
      }
    }
  }
`);
