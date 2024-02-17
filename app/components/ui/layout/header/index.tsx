import { HeaderLogo } from "@/components/logo";
import BaseLink from "next/link";
import AuthControls from "@/components/ui/layout/header/auth-controls";
import ROUTES from "@/lib/routes";
import { Search } from "@/components/ui/common/search";

export default async function Header() {
  return (
    <div className="border-b-2 w-full">
      <div className="flex justify-between max-w-screen-2xl mx-auto py-2 px-2 items-center">
        <div className="flex items-center w-1/5">
          <BaseLink
            href={ROUTES.HOME}
            className="p-2 rounded border-transparent border hover:border-black"
          >
            <HeaderLogo />
          </BaseLink>
        </div>
        <div className="flex items-center justify-between rounded w-3/5 h-min">
          <Search />
          <BaseLink href="/search/6">Search</BaseLink>
        </div>
        <div className="flex items-center w-1/5 justify-end">
          <AuthControls />
        </div>
      </div>
    </div>
  );
}
