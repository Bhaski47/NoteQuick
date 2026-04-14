import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const protectedRoutes = ["/my-task", "/dashboard", "/calendar", "/settings"];

  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  console.log(isProtectedRoute);
  
  if (isProtectedRoute) {
    const token = request.cookies.get("token")?.value;
    console.log("token");
    console.log(token);
    
    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    console.log(process.env.JWT_SECRET);
    
    try {
      const secret = Buffer.from(process.env.JWT_SECRET!, "base64");
      await jwtVerify(token, secret);

      return NextResponse.next();
    } catch (error) {
      console.error("JWT Verification Error:", error);
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/my-task", "/calendar", "/settings"],
};
