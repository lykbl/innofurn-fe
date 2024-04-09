import { RootCollectionsQuery } from '@/gql/queries/collection';
import apolloClient from '@/lib/apollo/apollo-client';
import BaseLink from 'next/link';
import { useFragment } from '@/gql/generated';
import { RootCollectionFragmentFragmentDoc } from '@/gql/generated/graphql';
import { Button } from '@/components/ui/common/button';

const CACHE_MINUTES = 60 * 5;
export default async function Subheader() {
  const { data: rootCollectionsQuery } = await apolloClient.getClient().query({
    query: RootCollectionsQuery,
    context: {
      fetchOptions: {
        next: { revalidate: CACHE_MINUTES },
      },
    },
  });
  const rootCollections = rootCollectionsQuery.rootCollections?.map(
    (rootCollection) =>
      useFragment(RootCollectionFragmentFragmentDoc, rootCollection),
  );

  return (
    <div className="flex w-full items-center border-b-2">
      <div className="mx-auto flex max-w-screen-2xl justify-between gap-2 px-2 py-2">
        {rootCollections?.map((rootCollection) => (
          <Button variant="link" size="link" key={rootCollection.id}>
            <BaseLink href={`/search/${rootCollection.defaultUrl.slug}`}>
              {rootCollection.name}
            </BaseLink>
          </Button>
        ))}
      </div>
    </div>
  );
}
