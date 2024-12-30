// import { jwtDecode } from 'jwt-decode'
// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('token')?.value || ''
//   const isAuthPage = request.nextUrl.pathname.startsWith('/login') ||
//                      request.nextUrl.pathname.startsWith('/register')

//   if (!token && !isAuthPage) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   if (token) {
//     try {
//       const decoded = jwtDecode(token)
//       const isExpired = decoded.exp ? Date.now() >= decoded.exp * 1000 : true

//       if (isExpired) {
//         return NextResponse.redirect(new URL('/login', request.url))
//       }

//       if (isAuthPage) {
//         return NextResponse.redirect(new URL('/dashboard', request.url))
//       }
//     } catch (error) {
//       console.error('Error decoding token:', error)
//       return NextResponse.redirect(new URL('/login', request.url))
//     }
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// }

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Allow all requests without any redirections
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
