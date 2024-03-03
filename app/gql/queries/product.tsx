import { gql } from '@/gql/generated';

export const FiltersQuery = gql(/* GraphQL */ `
  query optionFiltersForCollection($productTypeId: IntID!) {
    optionFiltersForCollection(productTypeId: $productTypeId) {
      ...ProductOptionFragment
    }
  }
`);

export const SearchProductsQuery = gql(/* GraphQL */ `
  query FindProducts(
    $filters: ProductFilterInput!
    $first: Int!
    $page: Int!
    $orderBy: ProductOrderBy!
  ) {
    findProducts(
      filters: $filters
      first: $first
      page: $page
      orderBy: $orderBy
    ) {
      data {
        ...ProductGridFragment
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
