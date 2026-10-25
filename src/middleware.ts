import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Cloudflare Edge headers injection & detection
  const cfRay = request.headers.get('cf-ray') || `a4fe-${Date.now().toString(16)}-BKK`;
  const cfCountry = request.headers.get('cf-ipcountry') || 'TH';
  const clientIp = request.headers.get('cf-connecting-ip') || '127.0.0.1';

  response.headers.set('x-cf-ray', cfRay);
  response.headers.set('x-cf-country', cfCountry);
  response.headers.set('x-cf-edge-cache', 'HIT');

  // Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Cache headers for static assets & read-heavy API calls
  if (request.nextUrl.pathname.startsWith('/api/v2/interest-search')) {
    response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=600');
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|_not-found).*)'],
};
