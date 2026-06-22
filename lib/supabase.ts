import { createClient } from "@supabase/supabase-js";

export type ScanPreview = {
  preview_slug: string;
  email: string | null;
  first_name: string | null;
  company_name: string | null;
  website: string | null;
  segment: string | null;
  state: string | null;
  offer_url: string | null;
  domain: string | null;
  psi_score: number | null;
  psi_perf_score: number | null;
  psi_acc_score: number | null;
  psi_ok: boolean;
  critical_issues_count: number;
  findings_json: string[];
  risk_label: string | null;
  roi_display: string | null;
  scanned_at: string;
};

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  return createClient(url, key);
}

export async function fetchPreviewBySlug(slug: string): Promise<ScanPreview | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("scan_results")
    .select(
      "preview_slug,email,first_name,company_name,website,segment,state,offer_url,domain,psi_score,psi_perf_score,psi_acc_score,psi_ok,critical_issues_count,findings_json,risk_label,roi_display,scanned_at"
    )
    .eq("preview_slug", slug)
    .eq("scan_type", "outbound_preview")
    .maybeSingle();
  if (error || !data) return null;
  return data as ScanPreview;
}
