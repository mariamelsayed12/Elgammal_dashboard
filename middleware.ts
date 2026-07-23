import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/app/lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login";
  const isApiRoute = pathname.startsWith("/api/");
  const isStaticFile = pathname.includes(".") || pathname.startsWith("/_next/");

  // Allow static files and API routes to bypass page protection
  if (isStaticFile || isApiRoute) {
    return NextResponse.next();
  }

  // If token is missing
  if (!token) {
    if (isAuthPage) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify the JWT token using jose
    await verifyToken(token);

    // If logged in and trying to access /login, redirect to /
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (error) {
    // If the token is invalid, expired, or malformed, clear the cookie and redirect to /login
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    return response;
  }
}

export const config = {
  // Protect all routes except static assets and standard next internal files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|login-bg.png|logo.svg).*)"],
};
