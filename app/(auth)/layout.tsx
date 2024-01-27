"use client";

import "@/styles/global.css";
import React, { useContext, useEffect } from "react";
// import { ReactQueryProvider } from "@/lib/query-provider"; //TODO remove this
// import { GraphQLClientProvider } from "@/lib/graphql-client-provider";
import { AuthControls } from "@/(auth)/header";
import { Button } from "@/components/ui/common/button";
import { redirect } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  CHECK_ME,
  CHECK_ME_FRAGMENT,
} from "@/components/ui/layout/header/auth-controls";
import { useFragment } from "@/gql";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: checkMeQuery } = useQuery(CHECK_ME);
  if (checkMeQuery?.checkMe) {
    redirect("/");
  }

  return (
    <div className="h-screen w-full">
      <header className="flex fixed bg-transparent p-2 justify-between">
        <div>
          {/* TODO add logo */}
          <Button variant="ghost">Logo goes here...</Button>
        </div>
        <div>
          <AuthControls />
        </div>
      </header>
      <main className="flex flex-col xl:flex-row">
        <div className="w-full bg-primary xl:h-full h-1/2"></div>
        <div className="w-full flex items-center justify-center bg-gray-100">
          {children}
        </div>
      </main>
    </div>
  );
}
