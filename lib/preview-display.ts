import type { ScanPreview } from "@/lib/supabase";

export type SegmentKey = "Dental" | "Medspa" | "HVAC" | "GENERAL";

const SEGMENT_BASE_MONTHLY: Record<SegmentKey, number> = {
  Dental: 8_200,
  Medspa: 6_400,
  HVAC: 4_800,
  GENERAL: 5_200,
};

const SEGMENT_ROI_CAP: Record<SegmentKey, number> = {
  Dental: 6_500,
  Medspa: 5_200,
  HVAC: 4_000,
  GENERAL: 4_500,
};

const SEGMENT_COPY: Record<
  SegmentKey,
  { label: string; hook: string; compliance: string }
> = {
  Dental: {
    label: "dental practice",
    hook: "new-patient booking and intake pages",
    compliance: "ADA Title III exposure on public appointment paths",
  },
  Medspa: {
    label: "medspa",
    hook: "consultation booking and treatment inquiry flows",
    compliance: "accessibility friction on high-intent service pages",
  },
  HVAC: {
    label: "HVAC contractor",
    hook: "estimate requests and emergency service landing pages",
    compliance: "mobile performance drag on lead-capture forms",
  },
  GENERAL: {
    label: "business",
    hook: "public booking and lead-capture pages",
    compliance: "WCAG / mobile lab signals on revenue-critical URLs",
  },
};

const DEFAULT_ROI = "$144,000";

export function normalizeSegment(raw: string | null | undefined): SegmentKey {
  const s = String(raw || "").trim().toLowerCase();
  if (s === "dental") return "Dental";
  if (s === "medspa") return "Medspa";
  if (s === "hvac") return "HVAC";
  return "GENERAL";
}

export function inferSegment(scan: ScanPreview): SegmentKey {
  if (scan.segment && String(scan.segment).trim()) {
    return normalizeSegment(scan.segment);
  }
  const hay = `${scan.company_name || ""} ${scan.website || ""} ${scan.domain || ""}`.toLowerCase();
  if (/\b(dental|dentist|orthodont|oral surgery|family dental)\b/.test(hay)) return "Dental";
  if (/\b(medspa|med spa|medical spa|botox|aesthetic|cosmetic|derma)\b/.test(hay)) return "Medspa";
  if (/\b(hvac|heating|cooling|air conditioning|ac repair|furnace)\b/.test(hay)) return "HVAC";
  return "GENERAL";
}

function formatMoney(n: number): string {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function performanceScore(scan: ScanPreview): number | null {
  if (scan.psi_perf_score != null) return scan.psi_perf_score;
  return null;
}

export function priorityScore(scan: ScanPreview): number | null {
  return scan.psi_score;
}

function perfForRoi(scan: ScanPreview): number | null {
  const perf = performanceScore(scan);
  if (perf != null) return perf;
  return scan.psi_score;
}

export function computeMonthlyRoi(scan: ScanPreview): number {
  const seg = inferSegment(scan);
  const base = SEGMENT_BASE_MONTHLY[seg];
  const cap = SEGMENT_ROI_CAP[seg];
  const critical = Math.max(1, Math.min(scan.critical_issues_count || 3, 8));
  let mult = 0.88 + critical * 0.04;

  const perf = perfForRoi(scan);
  if (perf != null) {
    if (perf < 30) mult *= 1.22;
    else if (perf < 50) mult *= 1.1;
    else if (perf >= 70) mult *= 0.9;
  }
  if (!scan.psi_ok) mult *= 0.9;

  return Math.min(Math.round(base * mult), cap);
}

export function displayRoi(scan: ScanPreview): { monthly: string; note: string } {
  const stored = String(scan.roi_display || "").trim();
  if (stored && stored !== DEFAULT_ROI && !stored.includes("–") && !stored.endsWith("/mo")) {
    return { monthly: stored, note: "Modeled from public-page friction signals." };
  }

  const high = computeMonthlyRoi(scan);
  const low = Math.max(Math.round(high * 0.68), Math.round(high * 0.55));
  const seg = inferSegment(scan);
  const signals = scan.critical_issues_count || 0;

  return {
    monthly: `${formatMoney(low)}–${formatMoney(high)}/mo`,
    note: `Conservative model for ${SEGMENT_COPY[seg].label} sites (${signals} priority signal${signals === 1 ? "" : "s"} on your URL).`,
  };
}

export function segmentCopy(scan: ScanPreview) {
  return SEGMENT_COPY[inferSegment(scan)];
}

export function formatScannedAt(iso: string | null | undefined): string {
  if (!iso) return "Recent lab scan";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recent lab scan";
  }
}

export function displayDomain(scan: ScanPreview): string {
  if (scan.domain) return scan.domain;
  try {
    const u = scan.website || "";
    if (!u) return "";
    return new URL(u.startsWith("http") ? u : `https://${u}`).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

export function priorityLabel(scan: ScanPreview): string {
  const r = String(scan.risk_label || "").toUpperCase();
  if (r.includes("HIGH")) return "High";
  if (r.includes("ELEVATED")) return "Elevated";
  if (r.includes("MODERATE")) return "Moderate";
  if (r.includes("PENDING")) return "Queued";
  return "Elevated";
}

export function riskHeadline(scan: ScanPreview): string {
  return String(scan.risk_label || "ELEVATED RISK").replace(/_/g, " ");
}
