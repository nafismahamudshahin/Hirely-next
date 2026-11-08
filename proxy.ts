import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./lib/auth";

// Routes that need a signed-in user
const protectedRoutes = ["/dashboard", "/profile", "/saved-jobs", "/applications", "/admin"];
// Routes a signed-in user shouldn't see
const authRoutes = ["/login", "/signup"];

// "/profile" and "/profile/edit" match, "/profile-x" does not
const matches = (pathname: string, route: string) =>
    pathname === route || pathname.startsWith(`${route}/`);

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const session = await auth.api.getSession({ headers: request.headers });
    const user = session?.user as { role?: string } | undefined;

    // Signed out -> login, and come back afterwards (login form reads ?next=)
    if (!user && protectedRoutes.some((route) => matches(pathname, route))) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Signed in -> no need for login/signup
    if (user && authRoutes.some((route) => matches(pathname, route))) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Admin area is admin-only
    if (user && matches(pathname, "/admin") && user.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/profile/:path*",
        "/saved-jobs/:path*",
        "/applications/:path*",
        "/admin/:path*",
        "/login",
        "/signup",
    ],
};