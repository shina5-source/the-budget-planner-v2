import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Vérifier si un cookie de session Supabase existe
  const allCookies = req.cookies.getAll();
  const hasSupabaseCookie = allCookies.some(cookie => 
    cookie.name.includes('supabase') || 
    cookie.name.includes('sb-')
  );

  const isAuthPage = req.nextUrl.pathname.startsWith('/auth');

  // Si pas de cookie Supabase et pas sur la page auth, rediriger vers /auth
  if (!hasSupabaseCookie && !isAuthPage) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/auth';
    return NextResponse.redirect(redirectUrl);
  }

  // Si connecté et sur la page auth, rediriger vers l'accueil
  if (hasSupabaseCookie && isAuthPage) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

// Protéger toutes les pages sauf les fichiers statiques
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|logo-shina5.png).*)',
  ],
};
