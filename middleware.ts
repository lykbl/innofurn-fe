import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  if (false && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
  } else {
    const response = NextResponse.next();

    return response;
  }
}

export const config = {
  matcher: '/login',
};
