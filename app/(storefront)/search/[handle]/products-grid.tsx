import {
  FindProductsQuery,
  ProductGridFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { Item } from '@/(storefront)/search/[handle]/item-card';
import React from 'react';
import { FragmentType, useFragment } from '@/gql/generated';
import { ApolloError } from '@apollo/client';

export const ProductsGrid = ({
  data,
  error,
}: {
  data: FindProductsQuery;
  error: ApolloError | undefined;
}) => {
  if (error) {
    return <div>Sorry! Products could not be loaded.</div>;
  }

  return data?.findProducts.data.map(
    (product: FragmentType<typeof ProductGridFragmentFragmentDoc>) => (
      <Item
        key={useFragment(ProductGridFragmentFragmentDoc, product).id}
        productFragment={product}
      />
    ),
  );
};
