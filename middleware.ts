// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'
// import { jwtDecode } from "jwt-decode"

// export function middleware(request: NextRequest) {
//   const token = request.cookies.get('token')?.value

//   // Allow access to login and register pages without a token
//   if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
//     return NextResponse.next()
//   }

//   // Redirect to login if no token is present
//   if (!token) {
//     return NextResponse.redirect(new URL('/login', request.url))
//   }

//   try {
//     const decoded = jwtDecode(token)
//     const isExpired = decoded.exp ? Date.now() >= decoded.exp * 1000 : true

//     if (isExpired) {
//       return NextResponse.redirect(new URL('/login', request.url))
//     }
//   } catch (error) {
//     console.error('Error decoding token:', error)
//     return NextResponse.redirect(new URL('/login', request.url))
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
