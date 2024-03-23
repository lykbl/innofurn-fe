import apolloClient from '@/lib/apollo/apollo-client';
import OutlinedLink from '@/(storefront)/components/outlined-link';
import Image from 'next/image';
import { RootCollectionsQuery } from '@/gql/queries/collection';
import { useFragment } from '@/gql/generated';
import { RootCollectionFragmentFragmentDoc } from '@/gql/generated/graphql';

const CACHE_MINUTES = 60 * 5;
const Collections = async () => {
  const { data: rootCollectionsQuery } = await apolloClient.getClient().query({
    query: RootCollectionsQuery,
    context: {
      fetchOptions: {
        next: { revalidate: CACHE_MINUTES },
      },
    },
  });

  if (!rootCollectionsQuery?.rootCollections) {
    return null;
  }

  const rootCollections = rootCollectionsQuery.rootCollections.map(
    (rootCollection) =>
      useFragment(RootCollectionFragmentFragmentDoc, rootCollection),
  );

  return (
    <div className="flex flex-wrap justify-between">
      <OutlinedLink href="/collections/promotion" className="rounded-full">
        <Image
          src="https://via.placeholder.com/205x205.png/004466?text=featured-promo"
          alt="alt"
          width={205}
          height={205}
          className="rounded-full"
        />
      </OutlinedLink>
      {rootCollections.map((rootCollection) => (
        <OutlinedLink
          href={`/collections/${rootCollection.defaultUrl.slug}`}
          key={rootCollection.id}
        >
          <Image
            src={
              rootCollection?.thumbnail?.conversions[0] ||
              'https://via.placeholder.com/205x205.png/004466?text=featured-promo'
            }
            alt="alt"
            width={205}
            height={205}
            className="rounded"
          />
        </OutlinedLink>
      ))}
    </div>
  );
};

export default Collections;
