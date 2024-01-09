'use client';
import BaseLink from "next/link";
import ROUTES from "@/lib/routes";
import { BiAlarm, BiShoppingBag, BiUser } from "react-icons/bi";
import { gql } from "@/gql";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useGraphQLClient } from "@/lib/graphql-client-provider";
import { Button } from "@/components/ui/common/button";

function UserControls () {
  return (
    <>
      <Button>
        <BaseLink
          href={ROUTES.LOGIN}
        >
          Profile
          <BiUser
            size={24}
          />
        </BaseLink>
      </Button>
      <Button>
        Cart
        <BiShoppingBag
          size={24}
        />
      </Button>
      <Button>
        <BiAlarm
          size={24}
        />
      </Button>
    </>
  );
}

function GuestControls() {
  return (
    <div className="flex gap-2">
      <Button>
        <BiShoppingBag
          size={24}
        />
      </Button>
      <Button>
        <BaseLink
          href={ROUTES.LOGIN}
        >
          Login
        </BaseLink>
      </Button>
      <Button>
        <BaseLink
          href={ROUTES.SIGNUP}
        >
          Sign Up
        </BaseLink>
      </Button>
    </div>
  );
}

const CHECK_ME_QUERY = gql(/* GraphQL */`
  query CheckMe {
    checkMe {
      id
    }
  }
`);

function AuthControls() {
  // const authContext = useContext(AuthContext);
  const client = useGraphQLClient();
  console.log('checkking auth');
  const { isError, isSuccess } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => client.request(CHECK_ME_QUERY),
  });
  // const result = useSuspenseQuery({
  //   queryKey: ['auth'],
  //   queryFn: async () => client.request(CHECK_ME_QUERY),
  // });
  // console.log(result)

  if (isError) {
    return <UserControls />;
  }

  if (isSuccess) {
    return <GuestControls />;
  }

  return (
    <>
      Loading!!
    </>
  );
}

export default AuthControls;
