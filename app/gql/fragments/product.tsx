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

const ProductVariantGridFragment = gql(/* GraphQL */ `
  fragment ProductVariantGridFragment on ProductVariant {
    id
    name
    product {
      defaultUrl {
        slug
      }
      #      colorOptions {
      #        ...ColorOptionFragment
      #      }
    }
    primaryImage {
      id
      name
      conversions(types: [MEDIUM])
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
`);

const ProductVariantSearchPreviewFragment = gql(/* GraphQL */ `
  fragment ProductVariantSearchPreviewFragment on ProductVariant {
    id
    name
    description
    product {
      id
      brand {
        id
        name
        defaultUrl {
          slug
        }
      }
      defaultUrl {
        slug
      }
      variantsCount
    }
    averageRating
    reviewsCount
    primaryImage {
      id
      name
      conversions(types: [SMALL])
    }
    prices {
      id
      price
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
    images(page: $imagesPage) {
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

const ColorOptionFragment = gql(/* GraphQL */ `
  fragment ColorOptionFragment on ProductOptionValue {
    id
    name
    variants(first: 1) {
      data {
        id
        primaryImage {
          id
          conversions(types: [MEDIUM])
        }
      }
    }
  }
`);

const ProductReviewsBreakdownFragment = gql(/* GraphQL */ `
  fragment ProductReviewsBreakdownFragment on Product {
    reviewsCount
    reviewsBreakdown
    averageRating
    variants {
      id
      name
    }
  }
`);

const ProductReviewFragment = gql(/* GraphQL */ `
  fragment ProductReviewFragment on Review {
    id
    title
    body
    rating
    createdAt
    variant {
      ...ProductReviewVariantFragment
    }
    customer {
      fullName
    }
  }
`);

const ProductReviewVariantFragment = gql(/* GraphQL */ `
  fragment ProductReviewVariantFragment on ProductVariant {
    id
    name
  }
`);

//TODO remove fragment from name
const AssociatedProductsFragment = gql(/* GraphQL */ `
  fragment AssociatedProductsFragment on Product {
    id
    associations {
      target {
        ...ProductCardFragment
      }
    }
  }
`);

const ProductCardFragment = gql(/* GraphQL */ `
  fragment ProductCardFragment on Product {
    id
    name
    reviewsCount
    averageRating
    defaultUrl {
      id
      slug
    }
    brand {
      id
      name
      defaultUrl {
        id
        slug
      }
    }
    primaryImage {
      id
      name
      conversions(types: [MEDIUM])
    }
    startingPrice {
     price
    }
  }
`);
