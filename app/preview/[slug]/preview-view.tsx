import type { ScanPreview } from "@/lib/supabase";
import {
  displayDomain,
  displayRoi,
  formatScannedAt,
  performanceScore,
  priorityLabel,
  priorityScore,
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
  const first = esc(scan.first_name || "there");
  const company = esc(scan.company_name || "your business");
  const website = esc(scan.website || "");
  const risk = esc(riskHeadline(scan));
  const offer = esc(scan.offer_url || `${SITE}/#pricing`);
  const psiOk = !!scan.psi_ok;
  const seg = segmentCopy(scan);
  const roi = displayRoi(scan);
  const domain = esc(displayDomain(scan));
  const scanned = formatScannedAt(scan.scanned_at);
  const perf = performanceScore(scan);
  const priority = priorityScore(scan);
  const critical = scan.critical_issues_count || 0;
  const findings = Array.isArray(scan.findings_json) ? scan.findings_json : [];
  const showFindings = findings.length
    ? findings.slice(0, 4)
    : psiOk
      ? ["Lab scan completed — additional priorities unlock with Risk Shield monitoring."]
      : [
          `We are finishing the mobile lab pass on ${company}'s public site. Early signals often appear on ${seg.hook}.`,
        ];

  return (
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
            <p className="risk-alert-eyebrow">ADA risk signal · mobile lab</p>
            <p className="risk-alert-value">{risk}</p>
            <p className="risk-alert-sub">
              {critical > 0 ? (
                <>
                  <strong>{critical} priority issue{critical === 1 ? "" : "s"}</strong> flagged on{" "}
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
            <p className="pending-eyebrow">Live audit in progress</p>
            <p className="pending-value">Priority scan queued</p>
            <p className="pending-sub">
              Your URL is in the Risk Shield pipeline. We surface {seg.hook} first — full lab metrics
              populate automatically when the pass completes.
            </p>
          </div>
        )}

        <div className="roi-card">
          <p className="roi-label">Estimated monthly recoverable revenue</p>
          <p className="roi-value">{esc(roi.monthly)}</p>
          <p className="roi-note">{roi.note}</p>
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
          <span className="metric-label">Mobile performance</span>
          <span className="metric-value">
            {perf != null ? `${perf}/100` : psiOk ? "—" : "Pending"}
          </span>
        </div>
        <div className="metric-chip">
          <span className="metric-label">Accessibility</span>
          <span className="metric-value">
            {scan.psi_acc_score != null ? `${scan.psi_acc_score}/100` : psiOk ? "—" : "Pending"}
          </span>
        </div>
      </div>

      {psiOk && priority != null ? (
        <p className="priority-banner muted">
          <strong>Priority index:</strong> {priority}/100 — composite lab score combining mobile performance and
          accessibility friction (not a legal determination).
        </p>
      ) : null}

      <div className="card">
        <div className="pill">Personalized preview · {esc(seg.label)}</div>
        <h1>
          {first}, here is what we found on {company}&apos;s public site
        </h1>
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
            <strong>Google PageSpeed (mobile lab):</strong> Performance {perf}/100
            {scan.psi_acc_score != null ? ` · Accessibility ${scan.psi_acc_score}/100` : ""}. Lab data only —
            not a legal determination.
          </p>
        ) : psiOk && priority != null ? (
          <p className="muted">
            <strong>Lab scan completed.</strong> Priority index {priority}/100
            {scan.psi_acc_score != null ? ` · Accessibility ${scan.psi_acc_score}/100` : ""}. Performance
            score populates on the next scan pass.
          </p>
        ) : (
          <p className="muted">
            This page updates when the live lab pass completes. Risk Shield re-checks your domain weekly after
            signup.
          </p>
        )}
        <p>
          Prospects often decide on {seg.hook} before they ever call. Friction here shows up as fewer
          bookings, lower trust, and harder-to-defend accessibility exposure.
        </p>
      </div>

      <div className="card teaser">
        <h2>Findings on your URL</h2>
        <ul className="list findings-list">
          {showFindings.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <p className="muted">
          {psiOk
            ? "These are real lab signals from your domain. Risk Shield tracks changes week over week."
            : "Full finding list and fix priority unlock when monitoring is active."}
        </p>
      </div>

      <div className="card">
        <h2>What Risk Shield adds after checkout</h2>
        <ul className="list snapshot-includes">
          <li>Weekly automated WCAG / PageSpeed rescans on your domain</li>
          <li>Dated compliance reports you can share with counsel or leadership</li>
          <li>P1 / P2 / P3 remediation list your dev team can execute</li>
          <li>Alert when new critical issues appear on booking or intake paths</li>
        </ul>
        <p className="money">$197/mo — cancel anytime · $1,970/yr (2 months free)</p>
        <p>
          <a className="cta" href={offer}>
            Start weekly risk monitoring
          </a>
        </p>
        <p className="subcta sample-link">
          <a href={SAMPLE}>View sample monitoring report</a>
          {" · "}
          <a href={`${SITE}/#pricing`}>Compare plans</a>
        </p>
        <p className="trust">
          Karacan Analytics · ADA risk monitoring for {seg.label} operators. This preview is generated
          from public-page lab data for {company} only.
        </p>
      </div>
    </div>
  );
}

export function PreviewNotFound({ slug }: { slug: string }) {
  return (
    <div className="wrap">
      <div className="card">
        <h1>Preview not ready</h1>
        <p className="muted">
          No scan found for slug <code>{esc(slug)}</code>. If you received this link by email, reply and
          we will refresh it.
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
