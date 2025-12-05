import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Routes publiques - toujours accessibles
  const publicPaths = ['/auth', '/_next', '/favicon.ico', '/icons', '/manifest.json', '/logo-shina5.png', '/api'];
  
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Vérifier notre cookie personnalisé
  const authSession = req.cookies.get('auth-session');

  // Si pas de cookie auth-session, rediriger vers /auth
  if (!authSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/auth';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
