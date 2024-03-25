import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/common/button';
import { FragmentType, useFragment } from '@/gql/generated';
import {
  Exact,
  MediaPaginatorFragmentFragmentDoc,
  ProductDetailsQuery,
} from '@/gql/generated/graphql';
import { Card } from '@/components/ui/common/card';
import { FetchMoreFunction } from '@apollo/client/react/hooks/useSuspenseQuery';

const Images = ({
  variantImagesFragment,
  fetchMoreImages,
  slug,
}: {
  variantImagesFragment: FragmentType<typeof MediaPaginatorFragmentFragmentDoc>;
  slug: string;
  fetchMoreImages: FetchMoreFunction<
    ProductDetailsQuery,
    Exact<{ slug: string; imagesPage: number }>
  >;
}) => {
  const variantImages = useFragment(
    MediaPaginatorFragmentFragmentDoc,
    variantImagesFragment,
  );

  const handleLoadMoreImages = () =>
    fetchMoreImages({
      variables: {
        slug: slug,
        imagesPage: variantImages.paginatorInfo.currentPage + 1,
      },
    });

  return (
    <div className="flex flex-wrap justify-between gap-2">
      {variantImages.data.map(({ originalUrl, name }, index) => (
        <Card key={index}>
          <Image
            width={365}
            height={365}
            src={originalUrl}
            alt={name}
            className="rounded"
          />
        </Card>
      ))}
      {variantImages.paginatorInfo.hasMorePages && (
        <Button className="w-full" onClick={handleLoadMoreImages}>
          Show More
        </Button>
      )}
    </div>
  );
};

export default Images;
