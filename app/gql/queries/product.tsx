import { gql } from '@/gql/generated';

export const FiltersQuery = gql(/* GraphQL */ `
  query optionFiltersForCollection($slug: String!) {
    optionFiltersForCollection(slug: $slug) {
      ...ProductOptionFragment
    }
  }
`);

export const SearchProductsQuery = gql(/* GraphQL */ `
  query FindProductVariants(
    $filters: ProductFilterInput!
    $first: Int!
    $page: Int!
    $orderBy: ProductVariantOrderBy!
  ) {
    findProductVariants(
      filters: $filters
      first: $first
      page: $page
      orderBy: $orderBy
    ) {
      data {
        ...ProductVariantGridFragment
      }
      paginatorInfo {
        ...PaginatorInfoFragment
      }
    }
  }
`);

export const ProductDetailsQuery = gql(/* GraphQL */ `
  query ProductDetails($slug: String!, $page: Int!) {
    productDetails(slug: $slug) {
      ...ProductDetailsFragment
    }
  }
`);

export const UserReviewsQuery = gql(/* GraphQL */ `
  query UserReviews {
    userReviews {
      id
      title
      body
    }
  }
`);
