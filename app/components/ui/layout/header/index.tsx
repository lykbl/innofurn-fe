import { HeaderLogo } from '@/components/logo';
import BaseLink from 'next/link';
import AuthControls from '@/components/ui/layout/header/auth-controls';
import ROUTES from '@/lib/routes';
import { Search } from '@/components/ui/common/search';

export default async function Header() {
  return (
    <div className="w-full border-b-2">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-2 py-2">
        <div className="flex w-1/5 items-center">
          <BaseLink
            href={ROUTES.HOME}
            className="rounded border border-transparent p-2 hover:border-black"
          >
            <HeaderLogo />
          </BaseLink>
        </div>
        <div className="flex h-min w-3/5 items-center justify-between rounded">
          <Search />
          <BaseLink href="/search/6">Search</BaseLink>
        </div>
        <div className="flex w-1/5 items-center justify-end">
          <AuthControls />
        </div>
      </div>
    </div>
  );
}
