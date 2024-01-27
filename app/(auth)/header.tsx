"use client";

import BaseLink from "next/link";
import { buttonVariants } from "@/components/ui/common/button";
import ROUTES from "@/lib/routes";
import React from "react";
import { usePathname } from "next/navigation";

export function AuthControls() {
  const pathname = usePathname();
  const href = pathname === ROUTES.LOGIN ? ROUTES.SIGNUP : ROUTES.LOGIN;
  const label = pathname === ROUTES.LOGIN ? "Signup" : "Login";

  return (
    <BaseLink className={buttonVariants({ variant: "default" })} href={href}>
      {label}
    </BaseLink>
  );
}
