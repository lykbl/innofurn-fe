import { FragmentType, useFragment } from '@/gql/generated';
import { BrandFragmentFragmentDoc } from '@/gql/generated/graphql';
import React from 'react';
import { Button } from '@/components/ui/common/button';
import { Link } from '@/components/ui/common/link';

const BrandLink = ({
  brandFragment,
}: {
  brandFragment: FragmentType<typeof BrandFragmentFragmentDoc>;
}) => {
  const brand = useFragment(BrandFragmentFragmentDoc, brandFragment);

  return (
    <div className="flex gap-1 text-xl">
      <p>See more by</p>
      <Button asChild variant="link" size="link" className="text-xl">
        <Link href={`/brand/${brand.defaultUrl.slug}`}>{brand.name}</Link>
      </Button>
    </div>
  );
};

export default BrandLink;
