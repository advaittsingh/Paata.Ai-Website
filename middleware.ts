import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Redirect /docs to /documentation
  if (request.nextUrl.pathname === '/docs') {
    return NextResponse.redirect(new URL('/documentation', request.url))
  }
}

export const config = {
  matcher: '/docs'
}
