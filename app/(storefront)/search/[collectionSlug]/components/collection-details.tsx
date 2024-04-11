'use client';

import { useSuspenseQuery } from '@apollo/client';
import { gql } from '@/gql/generated';

export const CollectionDetailsQuery = gql(/* GraphQL */ `
  query CollectionDetailsQuery($slug: String!) {
    collectionDetails(slug: $slug) {
      id
      name
    }
  }
`);

export default function CollectionDetails({ slug }: { slug: string }) {
  const { data: collectionDetailsQuery } = useSuspenseQuery(
    CollectionDetailsQuery,
    {
      variables: { slug },
    },
  );

  return <h1>{collectionDetailsQuery.collectionDetails.name}</h1>;
}
