'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/common/button';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoChatboxEllipses } from 'react-icons/io5';
import CartControl from '@/(storefront)/product/[slug]/details/cart-control';

import { FragmentType, useFragment } from '@/gql/generated';

import {
  ProductDetailsFragmentFragmentDoc,
  ProductDetailsQuery,
  ProductDetailsVariantFragmentFragment,
  ProductDetailsVariantFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import ProductOptionsSelector from '@/(storefront)/product/[slug]/details/product-options-selector';
import { QueryResult } from '@apollo/client';
import BrandLink from '@/(storefront)/product/[slug]/details/brand-link';
import Images from '@/(storefront)/product/[slug]/details/images';
import FiveStars from '@/components/ui/common/five-stars';
import { Card } from '@/components/ui/common/card';

const getAvailableProductOptionValues = (
  variants: Array<ProductDetailsVariantFragmentFragment>,
) => {
  const result = variants.reduce(
    (
      acc: { [key: string]: { values: Array<string>; label: string } },
      variant,
    ) => {
      variant.values.forEach(({ name, option: { handle, label } }) => {
        if (!acc[handle]) {
          acc[handle] = { values: [], label };
        }
        if (!acc[handle].values.includes(name)) {
          acc[handle].values.push(name);
        }
      });
      return acc;
    },
    {},
  );

  return Object.entries(result).map(([handle, { values, label }]) => ({
    handle,
    values,
    label,
  }));
};

const getVariantOptionValues = (
  variant: ProductDetailsVariantFragmentFragment,
) => {
  return variant.values.reduce(
    (acc: { [key: string]: string }, { name, option: { handle } }) => {
      acc[handle] = name;

      return acc;
    },
    {},
  );
};

const findSelectedVariant = (
  variants: Array<ProductDetailsVariantFragmentFragment>,
  selectedOptionValues: { [key: string]: string },
): ProductDetailsVariantFragmentFragment | undefined => {
  return variants.find((variant) =>
    variant.values.every(
      ({ name, option: { handle } }) => selectedOptionValues[handle] === name,
    ),
  );
};

const Details = ({
  productDetailsFragment,
  fetchMoreImages,
}: {
  productDetailsFragment: FragmentType<
    typeof ProductDetailsFragmentFragmentDoc
  >;
  fetchMoreImages: QueryResult<ProductDetailsQuery>['fetchMore'];
}) => {
  const productDetails = useFragment(
    ProductDetailsFragmentFragmentDoc,
    productDetailsFragment,
  );

  const variants = productDetails.variants.map((variantFragment) =>
    useFragment(ProductDetailsVariantFragmentFragmentDoc, variantFragment),
  );
  const availableProductOptionValues =
    getAvailableProductOptionValues(variants);
  const [selectedOptionValues, setSelectedOptionValues] = useState<{
    [key: string]: string;
  }>(getVariantOptionValues(variants[0]));

  const selectedVariant =
    findSelectedVariant(variants, selectedOptionValues) || variants[0];
  const reviewsCount = selectedVariant.reviewsCount;
  const averageRating = selectedVariant.averageRating;
  const priceFragment = selectedVariant.prices[0];

  const handleSelectOption = (handle: string, value: string) => {
    setSelectedOptionValues((prev) => ({ ...prev, [handle]: value }));
  };

  return (
    <div className="flex gap-4">
      <Card className="w-1/2 p-2">
        <Images
          variantImagesFragment={selectedVariant.images}
          fetchMoreImages={fetchMoreImages}
        />
      </Card>
      <Card className="sticky top-0 flex h-max w-1/2 flex-col gap-2 p-2">
        <h1 className="text-4xl">{selectedVariant.name}</h1>
        <BrandLink brandFragment={productDetails.brand} />
        <FiveStars averageRating={averageRating} reviewsCount={reviewsCount} />
        <h2>{selectedVariant.description}</h2>
        <ProductOptionsSelector
          availableProductOptionValues={availableProductOptionValues}
          selectedOptionValues={selectedOptionValues}
          handleSelectOption={handleSelectOption}
        />
        {/*TODO add functionality*/}
        {/*<ExtraOffers />*/}
        <div className="flex items-center justify-between">
          <div className="flex-col text-lg">
            <p className="font-semibold">Have a question?</p>
            <p className="font-normal">We're here to help.</p>
          </div>
          <div className="flex gap-2">
            <Button className="flex gap-1 p-2">
              <FaPhoneAlt size={24} />
              <span>Call Us</span>
            </Button>
            <Button className="flex gap-1 p-2">
              <IoChatboxEllipses size={24} />
              <span>Call Us</span>
            </Button>
          </div>
        </div>
        <CartControl priceFragment={priceFragment} sku={selectedVariant.sku} />
      </Card>
    </div>
  );
};
export default Details;