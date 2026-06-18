import type { ScanPreview } from "@/lib/supabase";
import { offerUrls } from "@/lib/checkout-urls";
import {
  attentionScore,
  displayDomain,
  displayFirstName,
  displayRoi,
  formatScannedAt,
  heroFindings,
  performanceScore,
  priorityLabel,
  riskHeadline,
  segmentCopy,
} from "@/lib/preview-display";

const SAMPLE = "https://karacan-analytics.com/reports/sample.html";
const SITE = "https://karacan-analytics.com";

function esc(s: string | null | undefined) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function PreviewPage({ scan }: { scan: ScanPreview }) {
  const first = esc(displayFirstName(scan));
  const company = esc(scan.company_name || "your business");
  const website = esc(scan.website || "");
  const risk = esc(riskHeadline(scan));
  const offers = offerUrls(scan);
  const offer = esc(offers.monthly);
  const psiOk = !!scan.psi_ok;
  const seg = segmentCopy(scan);
  const roi = displayRoi(scan);
  const domain = esc(displayDomain(scan));
  const scanned = formatScannedAt(scan.scanned_at);
  const perf = performanceScore(scan);
  const attention = attentionScore(scan);
  const critical = scan.critical_issues_count || 0;
  const findings = heroFindings(scan);
  const heroLead = findings[0] || `Signals on ${company}'s public ${seg.hook}.`;

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
              <p className="risk-alert-eyebrow">ADA risk signal · {esc(seg.label)}</p>
              <p className="risk-alert-value">{risk}</p>
              <p className="risk-alert-sub">
                {critical > 0 ? (
                  <>
                    <strong>{critical} priority issue{critical === 1 ? "" : "s"}</strong> on{" "}
                    {company}&apos;s {seg.hook}. Not legal advice.
                  </>
                ) : (
                  <>
                    Public-page signals for {company} — {seg.compliance}. Not legal advice.
                  </>
                )}
              </p>
            </div>
          ) : (
            <div className="pending-card">
              <p className="pending-eyebrow">Preliminary review · {esc(seg.label)}</p>
              <p className="pending-value">Early signals on your public site</p>
              <p className="pending-sub">
                Lab metrics for {company} are finishing — findings below reflect common issues on{" "}
                {seg.hook}.
              </p>
            </div>
          )}

          <div className="roi-card">
            <p className="roi-label">{esc(roi.title)}</p>
            <p className="roi-hero-line">{esc(roi.heroLine)}</p>
            <p className="roi-value">{esc(roi.monthly)}</p>
            <p className="roi-note">{roi.note}</p>
          </div>
        </section>

        <section className="card hero-cta-card" aria-label="Your flagged issues">
          <div className="pill">Your URL · {esc(seg.label)}</div>
          <h1>
            {first}, we flagged issues on {company}&apos;s site
          </h1>
          <p className="hero-lead">{esc(heroLead)}</p>
          <ul className="list findings-list findings-list--hero">
            {findings.map((item, idx) => (
              <li key={idx}>{esc(item)}</li>
            ))}
          </ul>
          <div className="hero-cta-row">
            <a className="cta cta--hero" href={offer}>
              Start weekly monitoring — $197/mo
            </a>
          </div>
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
          <div className="metric-chip">
            <span className="metric-label">Attention score</span>
            <span className="metric-value">{attention != null ? `${attention}/100` : "—"}</span>
          </div>
          <div className="metric-chip">
            <span className="metric-label">Mobile performance</span>
            <span className="metric-value">
              {perf != null ? `${perf}/100` : psiOk ? "—" : "Pending"}
            </span>
          </div>
        </div>

        <div className="card">
          <h2>Scan details</h2>
          {website ? (
            <p className="site-link muted">
              URL reviewed:{" "}
              <a href={website} rel="noopener noreferrer">
                {website}
              </a>
            </p>
          ) : null}
          {psiOk && perf != null ? (
            <p className="muted">
              Google PageSpeed (mobile): Performance {perf}/100
              {scan.psi_acc_score != null ? ` · Accessibility ${scan.psi_acc_score}/100` : ""}.
            </p>
          ) : !psiOk ? (
            <p className="muted">PageSpeed metrics finish automatically on the next pass.</p>
          ) : null}
          <p className="muted">
            Risk Shield re-scans {seg.hook} weekly and archives dated reports for counsel.
          </p>
        </div>

        <div className="card card--footer">
          <p className="footer-includes">
            Weekly rescans · counsel-ready reports · P1/P2/P3 fix list · new-issue alerts
          </p>
          <p className="subcta sample-link">
            <a href={SAMPLE}>Sample weekly report</a>
            {" · "}
            <a href={`${SITE}/privacy`}>Privacy</a>
            {" · "}
            <a href="mailto:contact@karacan-analytics.com">Contact</a>
          </p>
          <p className="trust">
            Karacan Analytics LLC · ADA risk monitoring for {seg.label} operators. Not legal advice.
          </p>
        </div>
      </div>

      <aside className="sticky-cta" aria-label="Start monitoring">
        <div className="sticky-cta-inner">
          <p className="sticky-cta-copy">
            <strong>{company}</strong> · {critical || "—"} signal{critical === 1 ? "" : "s"}
          </p>
          <a className="cta cta--sticky" href={offer}>
            $197/mo
          </a>
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
          No scan found for slug <code>{esc(slug)}</code>. If you received this link by email, reply and we
          will refresh it.
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
