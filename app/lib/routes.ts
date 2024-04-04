import { ObjectValues } from '@/lib/types';

const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  OAUTH_REDIRECT: '/oauth/redirect',
  PROFILE: '/profile',
  BOOKMARKS: '/bookmarks',
  RECENTLY_VIEWED: '/recently-viewed',
  SETTINGS_ADDRESSES: '/settings/addresses',
  SETTINGS_PROFILE: '/settings/profile',
  SETTINGS_ORDERS: '/settings/orders',
  SETTINGS_REVIEWS: '/settings/reviews',
  HELP_CENTER: '/help-center',
} as const;


export type Route = ObjectValues<typeof ROUTES>;

export default ROUTES;
