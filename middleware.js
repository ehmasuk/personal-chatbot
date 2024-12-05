import { NextResponse } from "next/server";
import { auth } from "./auth";

export async function middleware(request) {
    const session = await auth();

    const path = request.nextUrl.pathname;

    // if (path.startsWith("/bot") && !session) {
    //     return NextResponse.redirect(new URL("/login", request.url));
    // }

    // if (path === "/" && !session) {
    //     return NextResponse.redirect(new URL("/login", request.url));
    // }
    // if (path === "/login" && session) {
    //     return NextResponse.redirect(new URL("/", request.url));
    // }
}

export const config = {
    matcher: ["/", "/login", "/bot/:path*"],
};
