import { Separator } from '@/components/ui/common/separator';
import { ReactNode, Suspense } from 'react';
import { Button } from '@/components/ui/common/button';
import BaseLink from 'next/link';
import ROUTES, { Route } from '@/lib/routes';

function NavigationLink({
  label,
  route,
}:{
  label: string,
  route: Route
}) {
  return (
    <li>
      <Button
        asChild
        variant="ghost"
        className="w-full justify-start"
      >
        <BaseLink href={route}>
          {label}
        </BaseLink>
      </Button>
    </li>
  );
}


export default function Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <h1>Settings</h1>
        <p>Manage your account settings</p>
      </div>
      <Separator />
      <nav className="flex w-full gap-4">
        <div className="w-1/5 flex flex-col gap-2">
          <div>
            <p className="font-semibold text-xl">Personal Information</p>
            <ul>
              <NavigationLink
                label="Account & Device Info"
                route={ROUTES.SETTINGS_PROFILE}
              />
              <NavigationLink
                label="Edit Addresses"
                route={ROUTES.SETTINGS_ADDRESSES}
              />
            </ul>
          </div>
          <div>
            <p className="font-semibold text-xl">Your Purchases</p>
            <ul>
              <NavigationLink
                label="Find Your Purchases"
                route={ROUTES.SETTINGS_ORDERS}
              />
              <NavigationLink
                label="See Your Reviews"
                route={ROUTES.SETTINGS_REVIEWS}
              />
            </ul>
          </div>
          <div>
            <p className="font-semibold text-xl">Need Help?</p>
            <ul>
              <NavigationLink
                label="Help Center"
                route={ROUTES.HELP_CENTER}
              />
            </ul>
          </div>
        </div>
        <div className="w-4/5">
          <Suspense>
            {children}
          </Suspense>
        </div>
      </nav>
    </div>
  );
}
