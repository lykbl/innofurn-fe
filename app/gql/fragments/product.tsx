import { gql } from '@/gql/generated';

const ProductOptionValueFragment = gql(/* GraphQL */ `
  fragment ProductOptionValueFragment on ProductOptionValue {
    name
  }
`);

const ProductOptionFragment = gql(/* GraphQL */ `
  fragment ProductOptionFragment on ProductOption {
    values {
      ...ProductOptionValueFragment
    }
    handle
    label
  }
`);

const DiscountFragment = gql(/* GraphQL */ `
  fragment DiscountFragment on Discount {
    id
    data
    name
    type
  }
`);

const ProductGridFragment = gql(/* GraphQL */ `
  fragment ProductGridFragment on Product {
    id
    name
    discounts {
      ...DiscountFragment
    }
    variants {
      id
      name
      attributes
      images {
        data {
          name
          originalUrl
        }
      }
      isFeatured
      isFavorite
      prices {
        id
        price
      }
      averageRating
      reviewsCount
      discounts {
        ...DiscountFragment
      }
    }
  }
`);

const PaginatorInfoFragment = gql(/* GraphQL */ `
  fragment PaginatorInfoFragment on PaginatorInfo {
    perPage
    total
    lastPage
    hasMorePages
    currentPage
  }
`);

const BrandFragment = gql(/* GraphQL */ `
  fragment BrandFragment on Brand {
    id
    name
    defaultUrl {
      slug
    }
  }
`);

const PriceFragment = gql(/* GraphQL */ `
  fragment PriceFragment on Price {
    price
  }
`);

const MediaPaginatorFragment = gql(/* GraphQL */ `
  fragment MediaPaginatorFragment on MediaPaginator {
    data {
      id
      name
      originalUrl
    }
    paginatorInfo {
      hasMorePages
      currentPage
    }
  }
`);

const ProductDetailsVariantFragment = gql(/* GraphQL */ `
  fragment ProductDetailsVariantFragment on ProductVariant {
    id
    name
    description
    attributes
    averageRating
    reviewsCount
    sku
    images(page: $page) {
      ...MediaPaginatorFragment
    }
    prices {
      ...PriceFragment
    }
    values {
      id
      name
      option {
        handle
        label
      }
    }
  }
`);

const ProductDetailsFragment = gql(/* GraphQL */ `
  fragment ProductDetailsFragment on Product {
    id
    name
    brand {
      ...BrandFragment
    }
    variants {
      ...ProductDetailsVariantFragment
    }
  }
`);
