import { useSuspenseQuery } from '@apollo/client';
import { useFragment } from '@/gql/generated';

import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  AssociatedProductsFragmentFragmentDoc,
  ProductCardFragmentFragmentDoc,
} from '@/gql/generated/graphql';
import { AssociatedProductsQuery } from '@/gql/queries/product';
import ProductCard from '@/components/product/product-card';

//TODO add merge function
export default function AssociatedProducts({ slug }: { slug: string }) {
  const { data } = useSuspenseQuery(AssociatedProductsQuery, {
    variables: {
      slug: slug,
    },
    fetchPolicy: 'no-cache',
  });
  const productDetails = useFragment(
    AssociatedProductsFragmentFragmentDoc,
    data?.productDetails,
  );
  const associatedProducts = productDetails?.associations.map((association) =>
    useFragment(ProductCardFragmentFragmentDoc, association.target),
  );

  return (
    <Carousel>
      <h2>You may be interested:</h2>
      <CarouselContent>
        {associatedProducts.map((product) => (
          <CarouselItem className="basis-1/6" key={product.id}>
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
