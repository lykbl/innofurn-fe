'use client';

import "@/styles/global.css";
import React, { useContext, useEffect } from "react";
import { gql } from "@/gql";
import { useQuery } from "@apollo/client";
import { AuthContext } from "@/components/contexts/auth-context";

const CHECK_ME = gql(/* GraphQL */`
    query CheckMe {
        checkMe {
            id
            email
            name
        }
    }
`);

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { data, loading, error } = useQuery(CHECK_ME);
  const { setUser } = useContext(AuthContext);
  useEffect(() => {
    if (data?.checkMe) {
      setUser(data.checkMe); //TODO fix this
    }
  }, [loading]);
  console.log('Check me', data, loading, error);

  return (
    <>
      {/*<header className="w-full">*/}
      {/*  <Header />*/}
      {/*  <Subheader />*/}
      {/*</header>*/}
      <main className="max-w-screen-2xl w-full py-4 mx-auto flex flex-col items-center">
        {children}
      </main>
      {/*<footer className="py-16 bg-neutral-100 w-full">*/}
      {/*  <Footer />*/}
      {/*</footer>*/}
    </>
  );
}
