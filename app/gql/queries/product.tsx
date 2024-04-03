import { gql } from '@/gql/generated';

export const ProductDetailsQuery = gql(/* GraphQL */ `
  query ProductDetails($slug: String!, $imagesPage: Int!) {
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

export const ProductReviewsBreakdownQuery = gql(/* GraphQL */ `
  query ProductReviewsBreakdown($slug: String!) {
    productDetails(slug: $slug) {
      ...ProductReviewsBreakdownFragment
    }
  }
`);

export const SearchProductReviewsQuery = gql(/* GraphQL */ `
  query SearchProductReviews(
    $filters: SearchProductReviewsFiltersInput!
    $orderBy: SearchProductReviewsOrderBy!
    $first: Int
    $page: Int
  ) {
    searchProductReviews(
      filters: $filters
      orderBy: $orderBy
      first: $first
      page: $page
    ) {
      data {
        ...ProductReviewFragment
      }
      paginatorInfo {
        hasMorePages
        currentPage
      }
    }
  }
`);

//TODO add merge function
export const AssociatedProductsQuery = gql(/* GraphQL */ `
  query AssociatedProductsQuery($slug: String!) {
    productDetails(slug: $slug) {
      ...AssociatedProductsFragment
    }
  }
`);

export const RecentlyViewedProductsQuery = gql(/* GraphQL */ `
  query RecentlyViewedProducts {
    recentlyViewedProducts {
      ...RecentlyViewedProductFragment
    }
  }
`);
