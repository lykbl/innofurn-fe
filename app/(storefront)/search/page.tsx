"use client";

import React, { Suspense } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSuspenseQuery } from "@apollo/client";
import { gql } from "@/gql";
import { ProductFilterInput, ProductOrderBy } from "@/gql/graphql";
import { Filters } from "@/(storefront)/search/filters";
import { Item } from "@/(storefront)/search/item-card";
import { Separator } from "@/components/ui/common/separator";

const DISCOUNT_FRAGMENT = gql(/* GraphQL */ `
    fragment DiscountFragment on Discount {
        id
        data
        name
        type
    }
`);

const SEARCH_PRODUCTS_QUERY = gql(/* GraphQL */ `
    query FindProducts($filters: ProductFilterInput!, $first: Int!, $page: Int!, $orderBy: ProductOrderBy!) {
        findProducts(filters: $filters, first: $first, page: $page, orderBy: $orderBy) {
            data {
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
                        name
                        originalUrl
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
            paginatorInfo {
                perPage
                total
            }
        }
    }
`);

const FILTERS_QUERY = gql(/* GraphQL */`
    query filterableAttributesForCollection($productTypeId: IntID!) {
        filterableAttributesForCollection(productTypeId: $productTypeId) {
            values
            handle
            label
            type
        }
    }
`);

export default function Page() {
  const { data, fetchMore, error } = useSuspenseQuery(SEARCH_PRODUCTS_QUERY, {
    variables: {
      filters: {},
      page: 1,
      first: 5,
      orderBy: ProductOrderBy.PRICE_DESC,
    },
  });
  const { data: availableFiltersQuery, error: filtersError } = useSuspenseQuery(FILTERS_QUERY, {
    variables: {
      productTypeId: 6,
    }
  });

  const [nameFilter, setNameFilter] = React.useState(null);
  const [priceFilter, setPriceFilter] = React.useState(null);
  const [ratingFilter, setRatingFilter] = React.useState(null);
  const [attributesFilter, setAttributesFilter] = React.useState(null);
  const [onSaleFilter, setOnSaleFilter] = React.useState(null);

  return (
    <div className="flex gap-2 w-full pb-10">
      <Filters
        dynamicAttributes={availableFiltersQuery?.filterableAttributesForCollection}
      />
      {/*<Separator orientation="vertical" />*/}
      <div className="flex flex-col gap-8 w-4/5 pl-4 border-l">
        <div className="flex justify-between items-end">
          <h1 className="text-3xl">Results for: {"Search query"}</h1>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="avg_review">
                Average customer review
              </SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-4 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-2">
          <Suspense fallback={<div>Loading...</div>}>
            {data?.findProducts.data.map((product, index) => (
              <Item
                key={index}
                product={product}
              />
            ))}
          </Suspense>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
