"use client";

import { useEffect, useRef } from "react";
import type { ScanPreview } from "@/lib/supabase";
import { offerUrls } from "@/lib/checkout-urls";
import {
  displayDomain,
  displayFirstName,
  displayRoi,
  formatScannedAt,
  partitionFindings,
  priorityLabel,
  riskHeadline,
  segmentCopy,
  settlementBlock,
} from "@/lib/preview-display";

const SITE = "https://karacan-analytics.com";

function esc(s: string | null | undefined) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function trackEvent(slug: string, event: string, dwellSec?: number) {
  const body = JSON.stringify({ slug, event, dwell_sec: dwellSec ?? null });
  if (typeof navigator !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/preview-event", new Blob([body], { type: "application/json" }));
    return;
  }
  fetch("/api/preview-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

function CtaPair({
  activation,
  monthly,
  slug,
  primaryLabel = "Fix top 3 issues + activate — $499",
  secondaryLabel = "Monitoring only — $197/mo",
}: {
  activation: string;
  monthly: string;
  slug: string;
  primaryLabel?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="hero-cta-row">
      <a className="cta cta--hero" href={activation} onClick={() => trackEvent(slug, "cta_click_499")}>
        {primaryLabel}
      </a>
      <a className="cta-secondary" href={monthly} onClick={() => trackEvent(slug, "cta_click_197")}>
        {secondaryLabel}
      </a>
    </div>
  );
}

export function PreviewPage({ scan }: { scan: ScanPreview }) {
  const slug = scan.preview_slug;
  const tracked = useRef({ view: false, s50: false, s80: false, dwell: false });

  useEffect(() => {
    if (!slug || tracked.current.view) return;
    tracked.current.view = true;
    trackEvent(slug, "view");

    const start = Date.now();
    const dwellTimer = window.setTimeout(() => {
      if (!tracked.current.dwell) {
        tracked.current.dwell = true;
        trackEvent(slug, "dwell_20", 20);
      }
    }, 20_000);

    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = window.scrollY / max;
      if (pct >= 0.5 && !tracked.current.s50) {
        tracked.current.s50 = true;
        trackEvent(slug, "scroll_50", Math.round((Date.now() - start) / 1000));
      }
      if (pct >= 0.8 && !tracked.current.s80) {
        tracked.current.s80 = true;
        trackEvent(slug, "scroll_80", Math.round((Date.now() - start) / 1000));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.clearTimeout(dwellTimer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [slug]);

  const first = esc(displayFirstName(scan));
  const company = esc(scan.company_name || "your business");
  const risk = esc(riskHeadline(scan));
  const offers = offerUrls(scan);
  const activation = esc(offers.activation);
  const monthly = esc(offers.monthly);
  const psiOk = !!scan.psi_ok;
  const seg = segmentCopy(scan);
  const roi = displayRoi(scan);
  const settlement = settlementBlock(scan);
  const domain = esc(displayDomain(scan));
  const scanned = formatScannedAt(scan.scanned_at);
  const critical = scan.critical_issues_count || 0;

  const { lead, visible, locked } = partitionFindings(scan);
  const heroLead = lead || `Signals on ${company}'s public ${seg.hook}.`;
  const lockedIssueCount = Math.max(critical - (lead ? 1 : 0) - visible.length, locked.length, 0);
  const lockedItems =
    locked.length > 0
      ? locked
      : [
          `Additional WCAG failure on ${company}'s booking path (P1)`,
          `Mobile contrast issue on ${seg.hook} (P2)`,
        ];

  return (
    <>
      <div className="wrap">
        <header className="preview-header">
          <p className="preview-brand">Karacan Analytics · Risk Shield</p>
          <p className="preview-meta">
            {domain ? (
              <>
                <span>{domain}</span>
                <span className="dot">·</span>
              </>
            ) : null}
            <span>Scanned {scanned}</span>
          </p>
        </header>

        <section
          className={`risk-dashboard${psiOk ? "" : " risk-dashboard--pending"}`}
          aria-label="Risk and revenue impact"
        >
          {psiOk ? (
            <div className="risk-alert" role="alert">
              <p className="risk-alert-eyebrow">
                {esc(settlement.stateLabel)} ADA exposure · {esc(seg.label)}
              </p>
              <p className="risk-alert-value">{risk}</p>
              <p className="risk-alert-sub settlement-block">
                Estimated demand-letter range for {esc(settlement.stateLabel)} businesses:{" "}
                <strong>
                  {esc(settlement.low)}–{esc(settlement.high)}
                </strong>
                . Risk Shield monitoring is {esc(settlement.monitoringAnnual)}/yr ({esc(settlement.dailyCost)}
                /day) — about {esc(settlement.pctOfLow)}% of one low-end settlement.
              </p>
              <p className="risk-alert-sub">
                {critical > 0 ? (
                  <>
                    <strong>
                      {critical} priority issue{critical === 1 ? "" : "s"}
                    </strong>{" "}
                    on {company}&apos;s {seg.hook}. Not legal advice.
                  </>
                ) : (
                  <>
                    Public-page signals for {company} — {seg.compliance}. Not legal advice.
                  </>
                )}
              </p>
              <div className="risk-alert-cta">
                <CtaPair activation={activation} monthly={monthly} slug={slug} />
              </div>
            </div>
          ) : (
            <div className="pending-card">
              <p className="pending-eyebrow">Preliminary review · {esc(seg.label)}</p>
              <p className="pending-value">Early signals on your public site</p>
              <p className="pending-sub">
                Lab metrics for {company} are finishing — findings below reflect common issues on {seg.hook}.
              </p>
            </div>
          )}

          <div className="roi-card roi-card--gated">
            <p className="roi-label">{esc(roi.title)}</p>
            <p className="roi-hero-line">{esc(roi.heroLine)}</p>
            <div className="roi-locked">
              <p className="roi-value roi-value--blur" aria-hidden="true">
                {esc(roi.monthly)}
              </p>
              <p className="roi-lock-note">
                Full monthly impact · page URLs · counsel-ready archive — unlocked with activation or monitoring.
              </p>
              <a
                className="cta cta--roi-lock"
                href={activation}
                onClick={() => trackEvent(slug, "cta_click_499")}
              >
                Unlock with $499 activation
              </a>
            </div>
          </div>
        </section>

        <section className="card hero-cta-card" aria-label="Your flagged issues">
          <div className="pill">Your URL · {esc(seg.label)}</div>
          <h1>
            {first}, we flagged issues on {company}&apos;s site
          </h1>
          <p className="hero-lead">{esc(heroLead)}</p>
          {visible.length > 0 ? (
            <ul className="list findings-list findings-list--hero">
              {visible.map((item, idx) => (
                <li key={idx}>{esc(item)}</li>
              ))}
            </ul>
          ) : null}
          {lockedIssueCount > 0 ? (
            <div className="findings-gate" aria-label="Additional issues require activation">
              <p className="findings-gate-eyebrow">
                +{lockedIssueCount} additional priority issue{lockedIssueCount === 1 ? "" : "s"} on {company}
                &apos;s {seg.hook}
              </p>
              <ul className="list findings-list findings-list--locked" aria-hidden="true">
                {lockedItems.map((item, idx) => (
                  <li key={idx}>{esc(item)}</li>
                ))}
              </ul>
              <p className="findings-unlock">
                <a className="link-high-contrast" href={activation} onClick={() => trackEvent(slug, "cta_click_499")}>
                  Unlock full P1/P2/P3 fix list — $499 activation
                </a>
              </p>
            </div>
          ) : null}
          <CtaPair activation={activation} monthly={monthly} slug={slug} />
        </section>

        <div className="metrics-row">
          <div className="metric-chip">
            <span className="metric-label">Risk level</span>
            <span className="metric-value">{priorityLabel(scan)}</span>
          </div>
          <div className="metric-chip">
            <span className="metric-label">Critical signals</span>
            <span className="metric-value">{critical || "—"}</span>
          </div>
          <div className="metric-chip metric-chip--locked">
            <span className="metric-label">Lab scores</span>
            <span className="metric-value metric-value--locked">Subscriber only</span>
            <span className="metric-lock-hint">Mobile perf + accessibility breakdown</span>
          </div>
          <div className="metric-chip metric-chip--locked">
            <span className="metric-label">Weekly archive</span>
            <span className="metric-value metric-value--locked">Locked</span>
            <span className="metric-lock-hint">Dated reports for counsel</span>
          </div>
        </div>

        <div className="card card--scan-gated">
          <h2>What happens after you activate</h2>
          <ul className="list findings-list">
            <li>We fix your top 3 booking-path issues within 48 hours (no call required)</li>
            <li>Full PageSpeed + accessibility scores for {company}&apos;s {seg.hook}</li>
            <li>Weekly re-scan + counsel-ready PDF archive ($197/mo after month 1)</li>
          </ul>
          <p className="muted what-next">
            <strong>Next steps:</strong> Pay on Stripe → fix plan in your inbox within 1 hour → patches live in 48h →
            weekly monitoring starts.
          </p>
        </div>

        <div className="card card--footer">
          <p className="footer-includes">
            DFY top-3 fixes · weekly rescans · counsel-ready reports · new-issue alerts
          </p>
          <p className="subcta">
            Questions?{" "}
            <a className="link-high-contrast" href="mailto:contact@karacan-analytics.com">
              Reply to your email or contact us
            </a>
            {" · "}
            <a className="link-high-contrast" href={`${SITE}/privacy`}>
              Privacy
            </a>
          </p>
          <p className="trust">
            Karacan Analytics LLC · ADA risk monitoring for {seg.label} operators. Not legal advice.
          </p>
        </div>
      </div>

      <aside className="sticky-cta" aria-label="Activate Risk Shield">
        <div className="sticky-cta-inner sticky-cta-inner--stack">
          <p className="sticky-cta-copy">
            <strong>{company}</strong> · {critical || "—"} signal{critical === 1 ? "" : "s"}
          </p>
          <div className="sticky-cta-actions">
            <a className="cta cta--sticky" href={activation} onClick={() => trackEvent(slug, "cta_click_499")}>
              Activate — $499
            </a>
            <a
              className="cta-secondary cta-secondary--sticky"
              href={monthly}
              onClick={() => trackEvent(slug, "cta_click_197")}
            >
              $197/mo only
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}

export function PreviewNotFound({ slug }: { slug: string }) {
  return (
    <div className="wrap">
      <div className="card">
        <h1>Preview not ready</h1>
        <p className="muted">
          No scan found for slug <code>{esc(slug)}</code>. If you received this link by email, reply and we will refresh
          it.
        </p>
        <p>
          <a className="cta" href={SITE}>
            karacan-analytics.com
          </a>
        </p>
      </div>
    </div>
  );
}
