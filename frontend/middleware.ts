/**
 * Next.js middleware for protected routes
 *
 * This middleware checks for a valid authentication token and redirects users
 * based on their authentication status and the requested route.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Specify public routes that don't require authentication
const publicRoutes = [
  '/', // Home/Login page
  '/signin', // Signin page
  '/signup', // Signup page
  '/test', // Test/Debug page
];

// 2. The matcher defines which routes the middleware will run on.
// This should include all routes except for API routes and static files.
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 3. Get the authentication token from cookies
  const token = request.cookies.get('auth_token')?.value;

  // 4. Determine if the user is authenticated
  const isAuthenticated = !!token;

  // 5. Check if the requested route is public
  const isPublicRoute = publicRoutes.includes(pathname);

  // 6. Redirect authenticated users from public routes to the main app
  if (isAuthenticated && isPublicRoute) {
    console.log(`Authenticated user on public route ${pathname}. Redirecting to /tasks-simple.`);
    return NextResponse.redirect(new URL('/tasks-simple', request.url));
  }

  // 7. Redirect unauthenticated users from protected routes to the login page
  if (!isAuthenticated && !isPublicRoute) {
    console.log(`Unauthenticated user on protected route ${pathname}. Redirecting to /.`);
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 8. If none of the above, allow the request to proceed
  return NextResponse.next();
}
