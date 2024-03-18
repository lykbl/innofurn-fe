import {
  ProductOptionFragmentFragment,
} from '@/gql/generated/graphql';
import React from 'react';
import { ColorFilter } from '@/(storefront)/search/[collectionSlug]/components/filters/options/color';
import { MultiSelectFilter } from '@/(storefront)/search/[collectionSlug]/components/filters/options/multi-select';

export const AttributeFilters = ({
  productOptions,
}: {
  productOptions?: Array<ProductOptionFragmentFragment>;
}) => {
  return productOptions?.map((productOption, index) => (
    <ProductOptionFilterInTypeContext
      key={index}
      productOption={productOption}
    />
  ));
};

const ProductOptionFilterInTypeContext = ({
  productOption,
}: {
  productOption: ProductOptionFragmentFragment;
}) => {
  const { handle, label, values } = productOption;
  if (handle === 'color') {
    return <ColorFilter values={values} handle={handle} label={label} />;
  }

  return (
    <MultiSelectFilter valuesFragments={values} handle={handle} label={label} />
  );
};
