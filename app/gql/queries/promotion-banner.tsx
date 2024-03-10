import { gql } from '@/gql/generated';

export const PromotionBannerTypeQuery = gql(/* GraphQL */ `
  query PromotionBannerType(
    $handle: PromotionBannerStyles!
    $first: Int!
    $page: Int!
    $conversionType: ConversionTypes!
  ) {
    promotionBannerType(
      handle: $handle
      first: $first
      page: $page
      conversionType: $conversionType
    ) {
      ...PromotionBannerTypeFragment
    }
  }
`);
