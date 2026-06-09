import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Serve legacy static HTML from /public at clean URLs. */
const STATIC_HTML: Record<string, string> = {
  "/": "/index.html",
  "/privacy": "/privacy.html",
  "/terms": "/terms.html",
  "/sample-report": "/sample-report.html",
};

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const target = STATIC_HTML[path];
  if (target) {
    return NextResponse.rewrite(new URL(target, request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/privacy", "/terms", "/sample-report"],
};
