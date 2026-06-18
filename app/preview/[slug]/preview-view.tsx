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
  const offerAnnual = esc(offers.annual);
  const offerPro = esc(offers.pro);
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
              <p className="pending-eyebrow">Preliminary review · {esc(seg.label)}</p>
              <p className="pending-value">Early signals on your public site</p>
              <p className="pending-sub">
                Lab metrics for {company} are finishing — below are the booking-path issues we most often
                flag on {seg.hook} before a demand letter arrives.
              </p>
            </div>
          )}

          <div className="roi-card">
            <p className="roi-label">Estimated monthly recoverable revenue</p>
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
              <li key={idx} className={idx === findings.length - 1 && findings.length > 2 ? "blur-finding" : ""}>
                {item}
              </li>
            ))}
          </ul>
          {findings.length > 2 ? (
            <p className="muted findings-unlock">
              Full P1/P2/P3 evidence map unlocks with weekly Risk Shield monitoring on your domain.
            </p>
          ) : null}
          <div className="hero-cta-row">
            <a className="cta cta--hero" href={offer}>
              Start weekly monitoring — $197/mo
            </a>
            <a className="cta-secondary" href={SAMPLE}>
              See sample weekly report
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

        {attention != null ? (
          <p className="priority-banner muted">
            <strong>Attention score {attention}/100</strong> — higher means more friction on public booking
            paths (composite lab signals; not a legal determination).
          </p>
        ) : null}

        <div className="card">
          <h2>Lab details for {company}</h2>
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
              {scan.psi_acc_score != null ? ` · Accessibility ${scan.psi_acc_score}/100` : ""}. Lab data
              only.
            </p>
          ) : psiOk ? (
            <p className="muted">
              <strong>Lab scan completed.</strong>
              {scan.psi_acc_score != null ? ` Accessibility ${scan.psi_acc_score}/100.` : ""} Performance
              score populates on the next pass.
            </p>
          ) : (
            <p className="muted">
              Detailed PageSpeed metrics populate automatically when the live pass completes. Risk Shield
              re-checks your domain weekly after signup.
            </p>
          )}
          <p>
            Prospects decide on {seg.hook} before they call. Friction here means fewer bookings and harder
            remediation records if a complaint arrives.
          </p>
        </div>

        <div className="card">
          <h2>What Risk Shield adds after checkout</h2>
          <ul className="list plan-includes">
            <li>Weekly automated WCAG / PageSpeed rescans on your domain</li>
            <li>Dated compliance reports you can share with counsel or leadership</li>
            <li>P1 / P2 / P3 remediation list your dev team can execute</li>
            <li>Alert when new critical issues appear on booking or intake paths</li>
          </ul>
          <p className="money">$197/mo — cancel anytime · $1,970/yr (2 months free) · Pro $397/mo (3 domains)</p>
          <p>
            <a className="cta" href={offer}>
              Start weekly risk monitoring — $197/mo
            </a>
          </p>
          <p className="plan-row">
            <a className="plan-link" href={offerAnnual}>
              Annual plan — $1,970/yr
            </a>
            {" · "}
            <a className="plan-link" href={offerPro}>
              Pro — $397/mo
            </a>
          </p>
          <p className="subcta sample-link">
            <a href={SAMPLE}>View sample monitoring report</a>
            {" · "}
            <a href={`${SITE}/#pricing`}>Compare plans</a>
          </p>
          <p className="trust">
            Karacan Analytics LLC · ADA risk monitoring for {seg.label} operators. This preview is generated
            from public-page lab data for {company} only.
          </p>
          <p className="preview-legal muted">
            <a href={`${SITE}/privacy`}>Privacy</a>
            {" · "}
            <a href={`${SITE}/terms`}>Terms</a>
            {" · "}
            <a href="mailto:contact@karacan-analytics.com">contact@karacan-analytics.com</a>
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
