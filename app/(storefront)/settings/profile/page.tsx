'use client';

import { CheckMeQuery } from '@/gql/queries/user';
import { useSuspenseQuery } from '@apollo/client';
import { Separator } from '@/components/ui/common/separator';
import { useFragment } from '@/gql/generated';
import { CheckMeFragmentFragmentDoc } from '@/gql/generated/graphql';
import UpdateDetailsForm from '@/(storefront)/settings/profile/update-details-form';
import UpdateEmailForm from '@/(storefront)/settings/profile/update-email-form';

export default function Page() {
  const { data: checkMeQuery } = useSuspenseQuery(CheckMeQuery);
  const user = useFragment(CheckMeFragmentFragmentDoc, checkMeQuery?.checkMe);

  return (
    <div className="flex w-2/3 flex-col gap-4">
      <div>
        <h2>Profile page</h2>
        <p>Your personal details</p>
      </div>
      <Separator />
      <div className="flex flex-col gap-12">
        <UpdateDetailsForm user={user} />
        <UpdateEmailForm user={user} />
      </div>
    </div>
  );
}
