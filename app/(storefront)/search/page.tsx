"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/common/card";
import { Button } from "@/components/ui/common/button";
import Image from "next/image";
import React, { Suspense } from "react";
import { RadioGroup, RadioGroupItem, RadioGroupItemIndicator } from "@/components/ui/radio-group";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { FiveStars, Star } from "@/components/rating/rating-breakdown";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/common/checkbox";
import { useSuspenseQuery } from "@apollo/client";
import { gql } from "@/gql";
import { Product, ProductOrderBy } from "@/gql/graphql";

const colorClasses = [
  "bg-red-600",
  "bg-emerald-600",
  "bg-blue-600",
  "bg-yellow-600",
  "bg-pink-600",
  "bg-purple-600",
  "bg-indigo-600",
  "bg-green-600",
  "bg-gray-600",
];

const Item = ({ product }: { product: Product }) => {
  if (!product || !product.variants) {
    return null;
  }

  const [selectedProductVariant, setSelectedProductVariant] = React.useState(product.variants[0]);
  const averageRating = selectedProductVariant.averageRating || 0;
  const reviewsCount = selectedProductVariant.reviewsCount || 0;
  // const inStock = 15;
  const isFavorite = selectedProductVariant.isFavorite;
  const isFeatured = selectedProductVariant.isFeatured;
  const onSale = false;
  const colorOptions = product.variants?.map(variant => {
    if (!variant.attributes) {
      return;
    }

    return variant.attributes?.color;
  }).filter(Boolean);
  const extraLabel = selectedProductVariant.attributes?.material?.en; //TODO specify lang

  const {
    currencyCode,
    currencyName,
    format,
    price,
  } = selectedProductVariant.prices?.[0].price;

  return (
    <Card className="max-h flex flex-col">
      <CardHeader className="relative p-0 space-y-0">
        {isFeatured && (
          <Badge className="bg-pink-600 absolute top-0 left-0">New</Badge>
        )}
        {onSale && (
          <Badge className="bg-emerald-600 absolute top-0 left-0">Sale</Badge>
        )}
        <Image
          className="rounded-t w-full"
          width={225}
          height={225}
          alt={selectedProductVariant.images[0]?.name || 'Not found'}
          src={selectedProductVariant.images[0]?.originalUrl || '/sample-kitchen-image-2.jpg'}
        />
      </CardHeader>
      <CardContent className="flex flex-col justify-end p-2 bg-muted h-full">
        <ColorOptions values={colorOptions} />
        <p>{selectedProductVariant.name || product.name}</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex py-1 items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 })
                    .fill(null)
                    .map((_, index) => (
                      <Star key={index} isFilled={index + 1 < averageRating} withGradient={index + 1 === Math.ceil(averageRating)} />
                    ))}
                </div>
                ({reviewsCount})
              </div>
            </TooltipTrigger>
            <TooltipContent></TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div>
          {onSale ? (
            <p className="text-xl">{format}$</p>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xl">
                {format}
                {/*{Math.ceil(format * 0.8 * 100) / 100}$*/}
              </span>
              <p className="text-xs line-through text-foreground/50">
                {format}$
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-muted p-2 flex justify-between items-stretch">
        <Badge className="text-xs">{extraLabel}</Badge>
        <div className="flex gap-1">
          <Button className="p-2 h-7 w-7">
            <Icons.heart className={cn(isFavorite ? "fill-white" : "")} />
          </Button>
          <Button className="p-2 h-7 w-7">
            <Icons.cart className="fill-primary" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

const SEARCH_PRODUCTS_QUERY = gql(/* GraphQL */ `
    query FindProducts($filters: ProductFilter!, $first: Int!, $page: Int!, $orderBy: ProductOrderBy!) {
        findProducts(filters: $filters, first: $first, page: $page, orderBy: $orderBy) {
            data {
                id
                name
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

const ColorOptions = ({ values }: { values: Array<string> }) => {
  if (!values.length) {
    return;
  }

  return (
    <RadioGroup
      loop //TODO wtf is this
      className="flex justify-center py-2"
    >
      {values.map((colorHex, index) => (
        <RadioGroupItem
          key={index}
          value={`radio-${index}`}
          id={`${colorHex}-radio`}
          style={{ backgroundColor: colorHex }}
        >
          <RadioGroupItemIndicator />
        </RadioGroupItem>
      ))}
    </RadioGroup>
  );
}

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

  return (
    <div className="flex gap-2 w-full pb-10">
      <Filters filters={availableFiltersQuery?.filterableAttributesForCollection} />
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

const Filters = ({ filters }: { filters: object }) => {
  return (
    <div className="flex flex-col w-1/5 pr-4 gap-4">
      <Accordion type="multiple">
        {filters.map(({ values, handle, label, type }) => (
          <AccordionItem value={handle}>
            <AccordionTrigger>{label}</AccordionTrigger>
            {values.map((value) => (
              <AccordionContent>{value}</AccordionContent>
            ))}
          </AccordionItem>
        ))}
        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent>
            <FiveStars filledStars={4} /> & Up
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex items-center space-x-2">
        <Checkbox id="on-sale" />
        <label
          htmlFor="on-sale"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          On Sale
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="on-sale" />
        <label
          htmlFor="on-sale"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          On Sale
        </label>
      </div>
    </div>
  );
}
