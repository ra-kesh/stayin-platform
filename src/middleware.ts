import { type NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { createAuthClient } from "better-auth/client";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/auth (Auth API routes - ADDED EXCLUSION)
     * - api/webhooks (Example: If you add webhooks later)
     * - Anything containing a '.' (e.g., static assets)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.).*)",
  ],
};

const authClient = createAuthClient();

export default async function middleware(req: NextRequest) {
  const sessionCookie = getSessionCookie(req);

  // const { data: session } = await authClient.getSession({
  //   fetchOptions: {
  //     headers: req.headers,
  //   },
  // });

  // console.log("[Middleware] Session:", session);

  console.log("[Middleware] Session Cookie:", sessionCookie);

  const url = req.nextUrl;
  const hostname = req.headers
    .get("host")!
    .replace(
      `.localhost:${process.env.PORT || "3000"}`,
      `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`
    );
  const searchParams = req.nextUrl.searchParams.toString();
  // Construct the path without the locale prefix if it exists
  const path = `${url.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  console.log(`[Middleware] Request: ${req.method} ${hostname}${path}`);

  if (path.startsWith("/api/")) {
    console.log("[Middleware] Passing through API request:", path);
    return NextResponse.next(); // Let API requests pass through without rewrite
  }

  // Rewrites for app pages
  if (hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    console.log(`[Middleware] Matched app subdomain: ${hostname}`);
    const rewriteTarget = `/app${path === "/" ? "" : path}`;
    console.log(`[Middleware] Rewriting to URL path: ${rewriteTarget}`);
    const rewriteUrl = req.nextUrl.clone();
    rewriteUrl.pathname = rewriteTarget;
    return NextResponse.rewrite(rewriteUrl);
  }

  // Rewrite root application to `/home` folder
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    console.log(
      `[Middleware] Rewriting root domain to /home${path === "/" ? "" : path}`
    );
    return NextResponse.rewrite(
      new URL(`/home${path === "/" ? "" : path}`, req.url)
    );
  }

  // Rewrite everything else to `/[domain]/[slug]` dynamic route
  console.log(
    `[Middleware] Rewriting other domain ${hostname} to /${hostname}${path}`
  );
  return NextResponse.rewrite(new URL(`/${hostname}${path}`, req.url));
}
