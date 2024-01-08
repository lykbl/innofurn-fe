'use client';

import { Button } from "@/ui/common/button";
import BaseLink from "next/link";
import ROUTES from "@/lib/routes";
import { BiShoppingBag, BiUser } from "react-icons/bi";

function AuthControls() {
  // const authContext = useContext(AuthContext);
  // const result = useSuspenseQuery(gql(`
  //   query CheckMe {
  //     checkMe {
  //       id
  //     }
  //   }
  // `), {
  //   errorPolicy: 'all',
  // });
  //
  // console.log(result)

  return (
    <>
      <Button className='mr-2'>
        <BaseLink
          href={ROUTES.LOGIN}
          className='flex'
        >
          Log In
          <BiUser
            size={24}
            className='ml-2'
          />
        </BaseLink>
      </Button>
      <Button className='flex'>
        Cart
        <BiShoppingBag
          className='ml-2'
          size={24}
        />
      </Button>
    </>
  );
}

export default AuthControls;
