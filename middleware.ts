/* DARKNESS */
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('auth')
  if (authCookie && request.url.includes("/login") && request.url.includes("/register")) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (!authCookie && request.url.includes("/account/disable-account")) {
    return NextResponse.redirect(new URL('/login?redirect=disable-account', request.url))
  }
}

export const config = {
  matcher: ['/login', '/register', '/account/disable-account'],
}