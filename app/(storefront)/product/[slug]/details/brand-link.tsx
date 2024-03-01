import { FragmentType, useFragment } from '@/gql/generated';
import { BrandFragmentFragmentDoc } from '@/gql/generated/graphql';
import Link from 'next/link';
import React from 'react';

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

export default BrandLink;
