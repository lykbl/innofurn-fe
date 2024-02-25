'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/common/button';
import { FaPhoneAlt } from 'react-icons/fa';
import { IoChatboxEllipses } from 'react-icons/io5';
import CartControl from '@/(storefront)/product/cart-control';

import Link from 'next/link';
import { FragmentType, useFragment } from '@/gql';

import {
  BrandFragmentFragmentDoc,
  ProductDetailsFragmentFragmentDoc,
  ProductDetailsVariantFragmentFragment,
  ProductDetailsVariantFragmentFragmentDoc,
} from '@/gql/graphql';
import ProductOptionsSelector from '@/(storefront)/product/product-options-selector';
import { Star } from '@/components/rating/rating-breakdown';

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
): ProductDetailsVariantFragmentFragment => {
  return (
    variants.find((variant) =>
      variant.values.every(
        ({ name, option: { handle } }) => selectedOptionValues[handle] === name,
      ),
    ) || variants[0]
  );
};

const ProductDetails = ({
  productDetailsFragment,
}: {
  productDetailsFragment: FragmentType<
    typeof ProductDetailsFragmentFragmentDoc
  >;
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
  const selectedVariant = findSelectedVariant(variants, selectedOptionValues);
  const reviewsCount = selectedVariant.reviewsCount;
  const averageRating = selectedVariant.averageRating;
  const priceFragment = selectedVariant.prices[0];

  const handleSelectOption = (handle: string, value: string) => {
    setSelectedOptionValues((prev) => ({ ...prev, [handle]: value }));
  };

  return (
    <div className="flex gap-4">
      <div className="w-1/2 pt-2">
        <div className="flex flex-wrap justify-between gap-y-2">
          {selectedVariant.images.map(({ originalUrl, name }, index) => (
            <div key={index}>
              <Image
                width={364}
                height={364}
                src={originalUrl}
                alt={name}
                className="rounded"
              />
            </div>
          ))}
          <Button className="w-full">Show More</Button>
        </div>
      </div>
      <div className="sticky top-0 flex w-1/2 flex-col gap-2 pt-2">
        <h1 className="text-4xl">{selectedVariant.name}</h1>
        <BrandLink brandFragment={productDetails.brand} />
        <div className="flex items-center gap-1">
          <div className="flex">
            {Array.from({ length: 5 })
              .fill(null)
              .map((_, index) => (
                <Star
                  key={index}
                  isFilled={index + 1 < averageRating}
                  withGradient={index + 1 === Math.ceil(averageRating)}
                  className="h-[24px] w-[24px]"
                />
              ))}
          </div>
          ({reviewsCount})
        </div>
        <h2>{selectedVariant.description}</h2>
        <ProductOptionsSelector
          availableProductOptionValues={availableProductOptionValues}
          selectedOptionValues={selectedOptionValues}
          handleSelectOption={handleSelectOption}
        />
        {/*TODO add functionality*/}
        {/*<ExtraOffers />*/}
        <div className="flex items-center justify-between rounded border border-solid border-secondary p-2">
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
        <CartControl priceFragment={priceFragment} />
      </div>
    </div>
  );
};

const BrandLink = ({
  brandFragment,
}: {
  brandFragment: FragmentType<typeof BrandFragmentFragmentDoc>;
}) => {
  const brand = useFragment(BrandFragmentFragmentDoc, brandFragment);

  return (
    <div className="flex gap-1 text-xl">
      <p className="">See more by</p>
      <Link
        href={`/brand/${brand.defaultUrl.slug}`}
        className="hover:text-blue-600 hover:underline"
      >
        {brand.name}
      </Link>
    </div>
  );
};

export default ProductDetails;
