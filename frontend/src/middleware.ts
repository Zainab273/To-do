/**
 * Next.js middleware for protected routes
 *
 * This middleware checks for a valid authentication token ('auth_token') and redirects users
 * based on their authentication status and the requested route.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Specify public routes that don't require authentication
const publicRoutes = [
  '/', // Home/Login page
  '/signup', // Signup page
  '/signin', // Signin page
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the authentication token from cookies
  const token = request.cookies.get('auth_token')?.value;

  // Determine if the user is authenticated
  const isAuthenticated = !!token;

  // Check if the requested route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // Redirect authenticated users from public routes to the main app
  if (isAuthenticated && isPublicRoute) {
    return NextResponse.redirect(new URL('/tasks-simple', request.url));
  }

  // Redirect unauthenticated users from protected routes to the login page
  if (!isAuthenticated && !isPublicRoute) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // If none of the above, allow the request to proceed
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
