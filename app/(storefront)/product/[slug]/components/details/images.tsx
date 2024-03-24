'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/common/button';
import { FragmentType, useFragment } from '@/gql/generated';
import {
  MediaPaginatorFragmentFragmentDoc,
  ProductDetailsQuery,
} from '@/gql/generated/graphql';
import { QueryResult } from '@apollo/client';
import { Card } from '@/components/ui/common/card';

const Images = ({
  variantImagesFragment,
  fetchMoreImages,
}: {
  variantImagesFragment: FragmentType<typeof MediaPaginatorFragmentFragmentDoc>;
  fetchMoreImages: QueryResult<ProductDetailsQuery>['fetchMore'];
}) => {
  const variantImages = useFragment(
    MediaPaginatorFragmentFragmentDoc,
    variantImagesFragment,
  );

  const handleLoadMoreImages = () =>
    fetchMoreImages({
      variables: { page: variantImages.paginatorInfo.currentPage + 1 },
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
