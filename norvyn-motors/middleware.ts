import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing } from './lib/i18n/config'
import { updateSession } from './lib/supabase/middleware'

const intlMiddleware = createMiddleware(routing)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ── Admin route protection ──────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next()
    }

    const response = NextResponse.next({ request })
    const { user } = await updateSession(request, response)

    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return response
  }

  // ── Locale routing for all public routes ───────────────────────
  return intlMiddleware(request)
}

export const config = {
  // Match everything except Next.js internals, static files, and API routes
  matcher: [
    '/((?!_next|_vercel|api|.*\\..*).*)',
  ],
}
