import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";

export const config = {
    matcher: ["/admin/:path*"],
};

export async function middleware(request: NextRequest) {
    // Allow login page through
    if (request.nextUrl.pathname === "/admin/login") {
        return NextResponse.next();
    }

    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(request, response, sessionOptions);

    if (!session.isAdmin) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return response;
}
