import { gql } from '@/gql/generated';

export const OptionFiltersForCollectionQuery = gql(/* GraphQL */ `
  query optionFiltersForCollection($slug: String!) {
    optionFiltersForCollection(slug: $slug) {
      ...ProductOptionFragment
    }
  }
`);

export const FindProductVariantsForCollectionQuery = gql(/* GraphQL */ `
  query FindProductVariants(
    $filters: ProductVariantsForCollectionFilterInput!
    $first: Int!
    $page: Int!
    $orderBy: ProductVariantOrderBy!
  ) {
    findProductVariantForCollection(
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

export const FindProductVariantsQuery = gql(/* GraphQL */ `
  query FindProductVariantsPreview($search: String!) {
    findProductVariants(search: $search) {
      data {
        ...ProductVariantSearchPreviewFragment
      }
      paginatorInfo {
        facetDistribution {
          count
          collection {
            name
            defaultUrl {
              slug
            }
          }
        }
      }
    }
  }
`);
