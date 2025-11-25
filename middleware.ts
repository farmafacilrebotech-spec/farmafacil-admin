import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Crear cliente de Supabase para middleware
  const supabase = createMiddlewareClient({ req, res });

  // Obtener la sesión del usuario
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoginPage = req.nextUrl.pathname === '/login';
  const isProtectedRoute = 
    req.nextUrl.pathname.startsWith('/dashboard') || 
    req.nextUrl.pathname.startsWith('/farmacias');

  // Si no hay sesión y está intentando acceder a ruta protegida, redirigir a login
  if (!session && isProtectedRoute) {
    const redirectUrl = new URL('/login', req.url);
    return NextResponse.redirect(redirectUrl);
  }

  // Si hay sesión y está en /login, redirigir al dashboard
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Si hay sesión en ruta protegida, verificar que sea admin
  if (session && isProtectedRoute) {
    const { data: admin, error } = await supabase
      .from('admins')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // Si no es admin o hay error, redirigir a login
    if (error || !admin) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (API routes)
     * - registro (rutas de registro público)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|registro).*)',
  ],
};

