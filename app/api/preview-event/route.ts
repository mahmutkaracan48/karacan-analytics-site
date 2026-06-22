import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const SLUG_RE = /^[a-f0-9]{16}$/;
const ALLOWED = new Set([
  "view",
  "scroll_50",
  "scroll_80",
  "dwell_20",
  "cta_click_499",
  "cta_click_197",
]);

const hits = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 30;
const WINDOW_MS = 60_000;

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const row = hits.get(ip);
  if (!row || now > row.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (row.count >= RATE_LIMIT) return false;
  row.count += 1;
  return true;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: { slug?: string; event?: string; dwell_sec?: number | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const slug = String(body.slug || "").trim().toLowerCase();
  const event = String(body.event || "").trim();
  if (!SLUG_RE.test(slug) || !ALLOWED.has(event)) {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return NextResponse.json({ ok: false, error: "misconfigured" }, { status: 500 });
  }

  const supabase = createClient(url, key);
  const dwell =
    body.dwell_sec != null && Number.isFinite(Number(body.dwell_sec))
      ? Math.max(0, Math.min(3600, Math.round(Number(body.dwell_sec))))
      : null;

  const { error } = await supabase.rpc("track_preview_event", {
    p_slug: slug,
    p_event_type: event,
    p_dwell_sec: dwell,
  });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
