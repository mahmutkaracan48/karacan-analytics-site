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

const SEGMENT_ROI_HERO: Record<
  SegmentKey,
  { title: string; unitLow: number; unitHigh: number; unitLabel: string }
> = {
  Dental: {
    title: "New-patient booking impact",
    unitLow: 450,
    unitHigh: 850,
    unitLabel: "lost online new-patient appointment",
  },
  Medspa: {
    title: "Consultation booking impact",
    unitLow: 350,
    unitHigh: 700,
    unitLabel: "missed consultation request",
  },
  HVAC: {
    title: "Service lead impact",
    unitLow: 280,
    unitHigh: 550,
    unitLabel: "lost service call or estimate request",
  },
  GENERAL: {
    title: "Lead-capture impact",
    unitLow: 300,
    unitHigh: 600,
    unitLabel: "lost booking or contact request",
  },
};

const ANTI_SELL_RE = /passed basic lab|monitoring continues weekly/i;

const SEGMENT_TEASERS: Record<SegmentKey, string[]> = {
  Dental: [
    "New-patient booking forms often fail contrast or missing aria-label checks on mobile.",
    "Homepage appointment CTAs are a frequent target in ADA demand letters.",
    "Intake flows without visible focus states block keyboard users from booking.",
  ],
  Medspa: [
    "Consultation booking buttons often lack accessible names on mobile service menus.",
    "Before/after galleries frequently ship without alt text on high-intent pages.",
    "Promo landing pages with low contrast offers are common settlement triggers.",
  ],
  HVAC: [
    "Emergency service CTAs on mobile often sit below slow-loading hero assets.",
    "Estimate request forms frequently miss labels tied to screen readers.",
    "Financing and service-area pages are common friction points on contractor sites.",
  ],
  GENERAL: [
    "Lead-capture forms on mobile often fail basic contrast and label checks.",
    "Primary CTAs without accessible names block keyboard users from converting.",
    "Slow mobile LCP on landing pages correlates with drop-off before contact.",
  ],
};

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

/** Higher = more public-page friction (aligns with risk urgency, not Lighthouse perf). */
export function attentionScore(scan: ScanPreview): number | null {
  const composite = scan.psi_score;
  const critical = Math.max(0, scan.critical_issues_count || 0);
  const perf = performanceScore(scan);
  let score = composite ?? 0;
  if (perf != null) score = Math.max(score, Math.round((100 - perf) * 0.85));
  score = Math.max(score, critical * 18);
  if (!scan.psi_ok) score = Math.max(score, 58);
  const label = String(scan.risk_label || "").toUpperCase();
  if (label.includes("HIGH")) score = Math.max(score, 78);
  else if (label.includes("ELEVATED")) score = Math.max(score, 62);
  return Math.min(99, Math.max(28, score));
}

const ARTICLE_PREFIXES = new Set(["the", "a", "an", "our", "your", "new", "best", "top", "all", "my"]);

export function displayFirstName(scan: ScanPreview): string {
  const fn = String(scan.first_name || "").trim();
  if (fn && !ARTICLE_PREFIXES.has(fn.toLowerCase()) && fn.length > 1) return fn;

  const company = String(scan.company_name || "").trim();
  const parts = company.split(/\s+/).filter(Boolean);
  if (!parts.length) return "there";
  if (ARTICLE_PREFIXES.has(parts[0].toLowerCase()) && parts[1]) {
    const second = parts[1];
    if (!ARTICLE_PREFIXES.has(second.toLowerCase())) return second;
  }
  if (ARTICLE_PREFIXES.has(parts[0].toLowerCase())) return "there";
  return parts[0];
}

export function heroFindings(scan: ScanPreview): string[] {
  const seg = inferSegment(scan);
  const teasers = SEGMENT_TEASERS[seg];
  const company = scan.company_name || "your site";
  let items = (Array.isArray(scan.findings_json) ? scan.findings_json : [])
    .map((f) => String(f).trim())
    .filter((f) => f && !ANTI_SELL_RE.test(f));

  if (!scan.psi_ok) {
    if (items.length) return items;
    return [
      `Early mobile lab signals on ${company}'s public booking paths are being finalized.`,
      teasers[0],
      teasers[1],
    ];
  }

  if (items.length < 2) {
    items = [...items, ...teasers];
  }
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const key = item.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out.length ? out : teasers;
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

export function displayRoi(scan: ScanPreview): {
  monthly: string;
  title: string;
  heroLine: string;
  note: string;
} {
  const seg = inferSegment(scan);
  const hero = SEGMENT_ROI_HERO[seg];
  const high = computeMonthlyRoi(scan);
  const low = Math.max(Math.round(high * 0.68), Math.round(high * 0.55));
  const signals = scan.critical_issues_count || 0;
  const unitRange = `${formatMoney(hero.unitLow)}–${formatMoney(hero.unitHigh)}`;

  return {
    monthly: `${formatMoney(low)}–${formatMoney(high)}/mo`,
    title: hero.title,
    heroLine: `Each ${hero.unitLabel} from ${SEGMENT_COPY[seg].hook} is often worth ${unitRange}.`,
    note: `Modeled for ${SEGMENT_COPY[seg].label} sites · ${signals} priority signal${signals === 1 ? "" : "s"} on your URL.`,
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

const STATE_SETTLEMENT: Record<string, { low: number; high: number; label: string }> = {
  TX: { low: 8_000, high: 22_000, label: "Texas" },
  AZ: { low: 7_500, high: 20_000, label: "Arizona" },
  DEFAULT: { low: 8_000, high: 22_000, label: "your state" },
};

const SEGMENT_DEFAULT_STATE: Record<SegmentKey, string> = {
  Dental: "TX",
  Medspa: "TX",
  HVAC: "AZ",
  GENERAL: "TX",
};

export function inferState(scan: ScanPreview): string {
  const raw = String(scan.state || "").trim().toUpperCase();
  if (raw === "TEXAS" || raw === "TX") return "TX";
  if (raw === "ARIZONA" || raw === "AZ") return "AZ";
  return SEGMENT_DEFAULT_STATE[inferSegment(scan)];
}

export function settlementBlock(scan: ScanPreview): {
  stateLabel: string;
  low: string;
  high: string;
  monitoringAnnual: string;
  dailyCost: string;
  pctOfLow: string;
} {
  const code = inferState(scan);
  const block = STATE_SETTLEMENT[code] || STATE_SETTLEMENT.DEFAULT;
  const low = block.low;
  const high = block.high;
  const annual = 1970;
  const pct = ((annual / low) * 100).toFixed(1);
  return {
    stateLabel: block.label,
    low: formatMoney(low),
    high: formatMoney(high),
    monitoringAnnual: formatMoney(annual),
    dailyCost: "$6.56",
    pctOfLow: pct,
  };
}

export function lockedFindings(scan: ScanPreview): string[] {
  const all = heroFindings(scan);
  return all.slice(2);
}
