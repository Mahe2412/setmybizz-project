import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If running locally (localhost), skip all restrictions
  const hostname = request.nextUrl.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  
  // Allow access to the coming-soon page and API/Static routes
  if (
    url.pathname.startsWith('/coming-soon') || 
    url.pathname.startsWith('/_next') || 
    url.pathname.startsWith('/api') || 
    url.pathname.startsWith('/assets') ||
    url.pathname.startsWith('/auth')
  ) {
    return NextResponse.next();
  }

  // Check for developer bypass code in URL params
  // The secret code to bypass the coming soon page is "Mahe102410"
  if (url.searchParams.get('dev') === 'Mahe102410') {
    const response = NextResponse.redirect(new URL('/bizos', request.url));
    // Set a cookie so they don't have to keep adding ?dev=...
    response.cookies.set('dev_access', 'true', { path: '/', maxAge: 60 * 60 * 24 * 30 }); // 30 days
    return response;
  }

  // Check if they already have the developer access cookie
  const devAccess = request.cookies.get('dev_access');
  if (devAccess?.value === 'true') {
    return NextResponse.next();
  }

  // If no access, redirect to coming soon page
  url.pathname = '/coming-soon';
  return NextResponse.redirect(url);
}

// Only match on pages, not internal Next.js assets
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
