import { ProductOptionFragmentFragmentDoc } from '@/gql/graphql';
import React from 'react';
import { ColorFilter } from '@/(storefront)/search/[handle]/filters/attributes/color';
import { MultiSelectFilter } from '@/(storefront)/search/[handle]/filters/attributes/multi-select';
import { FragmentType, useFragment } from '@/gql';

export const AttributeFilters = ({
  productOptions,
}: {
  productOptions: Array<FragmentType<typeof ProductOptionFragmentFragmentDoc>>;
}) => {
  return productOptions.map((productOptionFragment, index) => (
    <ProductOptionFilterInTypeContext
      key={index}
      productOptionFragment={productOptionFragment}
    />
  ));
};

const ProductOptionFilterInTypeContext = ({
  productOptionFragment,
}: {
  productOptionFragment: FragmentType<typeof ProductOptionFragmentFragmentDoc>;
}) => {
  const { handle, label, values } = useFragment(
    ProductOptionFragmentFragmentDoc,
    productOptionFragment,
  );
  if (handle === 'color') {
    return <ColorFilter values={values} handle={handle} label={label} />;
  }

  return <MultiSelectFilter values={values} handle={handle} label={label} />;
};
