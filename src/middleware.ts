import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from './lib/session'
import { cookies } from 'next/headers'

// 👉 Routes autorisées par rôle
const routeRoles: Record<string, string[]> = {
  'ADMIN': ['/support', '/settings', '/profile', '/images', '/payment'],
  'SUPPORT': ['/support', '/settings', '/profile', '/images', '/payment'],
  'LANDLORD': ['/landlord', '/renter', '/settings', '/profile', '/images', '/payment'],
  'RENTER': ['/renter', '/settings', '/profile', '/images', '/payment']
};

const publicRoutes = ['/signin', '/signup', '/unauthorized', '/'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  // ✅ Ne pas vérifier les routes publiques
  const isPublic = publicRoutes.some(publicPath => path.startsWith(publicPath));
  if (isPublic) {
    return NextResponse.next();
  }

  // 🔒 Lire et décrypter le cookie
  const cookie = (await cookies()).get('session')?.value;
  const session = await decrypt(cookie);

  // ⛔️ Pas de session, rediriger vers login
  if (!session) {
    return NextResponse.redirect(new URL('/signin', req.nextUrl));
  }

  // 🔐 Accès autorisé selon les rôles et leurs routes
  const userRoles = session.roles || [];
  const accessibleRoutes = new Set<string>();

  userRoles.forEach(role => {
    const routes = routeRoles[role];
    if (routes) {
      routes.forEach(route => accessibleRoutes.add(route));
    }
  });
  const isAuthorized = Array.from(accessibleRoutes).some(route => path.startsWith(route));
  if (!isAuthorized) {
    return NextResponse.redirect(new URL('/unauthorized', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
