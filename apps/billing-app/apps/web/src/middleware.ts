import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const EMBED_PATHS = [
  "/dashboard",
  "/invoices",
  "/parties",
  "/items",
  "/purchases",
  "/payments",
  "/inventory",
  "/reports",
  "/settings",
  "/onboarding",
  "/login",
];

function matchesEmbedPath(pathname: string) {
  return EMBED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function maybeEmbedRedirect(req: NextRequest): NextResponse | null {
  const { pathname, searchParams } = req.nextUrl;
  if (!matchesEmbedPath(pathname)) return null;

  const hasCookie = req.cookies.get("billease_embed")?.value === "1";
  const hasParam = searchParams.get("embed") === "1";

  if (!hasParam && hasCookie) {
    const url = req.nextUrl.clone();
    url.searchParams.set("embed", "1");
    return NextResponse.redirect(url);
  }

  return null;
}

function stampEmbedCookie(res: NextResponse, req: NextRequest) {
  if (req.nextUrl.searchParams.get("embed") === "1") {
    res.cookies.set("billease_embed", "1", {
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
    });
  }
  return res;
}

const authMiddleware = withAuth({
  pages: { signIn: "/login" },
});

export default function middleware(req: NextRequest) {
  const redirect = maybeEmbedRedirect(req);
  if (redirect) return redirect;

  // @ts-expect-error next-auth middleware overload
  const res = authMiddleware(req);
  if (res instanceof NextResponse) {
    return stampEmbedCookie(res, req);
  }
  return res;
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/invoices/:path*",
    "/parties/:path*",
    "/items/:path*",
    "/purchases/:path*",
    "/payments/:path*",
    "/inventory/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/onboarding",
  ],
};
