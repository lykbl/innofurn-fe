'use client';

import BaseLink from "next/link";
import ROUTES from "@/lib/routes";
import { BiAlarm, BiShoppingBag, BiUser } from "react-icons/bi";
import { gql } from "@/gql";
import { Button } from "@/components/ui/common/button";
import { useQuery } from "@apollo/client";

function UserControls() {
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
  const { data, error, loading } = useQuery(CHECK_ME_QUERY);

  if (error) {
    return <UserControls />;
  }

  if (!error) {
    return <GuestControls />;
  }

  return (
    <>
      Loading!!
    </>
  );
}

export default AuthControls;
