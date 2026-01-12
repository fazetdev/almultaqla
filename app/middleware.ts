import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production'
);

// Public routes that don't require authentication
const publicRoutes = [
  '/api/auth',
  '/api/health',
  '/login',
  '/register',
  '/',
];

// Check if a route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => 
    pathname === route || 
    pathname.startsWith(`${route}/`) ||
    // Allow public API routes
    pathname.startsWith('/api/auth') ||
    pathname === '/api/health'
  );
}

// Extract token from request
function extractToken(request: NextRequest): string | null {
  // Try to get token from Authorization header
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // Try to get token from cookies
  const token = request.cookies.get('token')?.value;
  if (token) {
    return token;
  }
  
  return null;
}

// Verify JWT token
async function verifyToken(token: string): Promise<{ isValid: boolean; payload?: any }> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return { isValid: true, payload };
  } catch (error) {
    return { isValid: false };
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Check for API routes
  if (pathname.startsWith('/api/')) {
    const token = extractToken(request);
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { isValid, payload } = await verifyToken(token);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
    
    // Add user info to request headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', payload.userId || '');
    requestHeaders.set('x-user-email', payload.email || '');
    requestHeaders.set('x-user-role', payload.role || '');
    requestHeaders.set('x-organization-id', payload.organizationId || '');
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  // For non-API routes (pages), redirect to login if not authenticated
  const token = extractToken(request);
  
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  const { isValid } = await verifyToken(token);
  
  if (!isValid) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
