import type { ScanPreview } from "@/lib/supabase";

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
  const risk = esc(scan.risk_label || "ELEVATED RISK");
  const roi = esc(scan.roi_display || "$144,000");
  const offer = esc(scan.offer_url || `${SITE}/#pricing`);
  const score = scan.psi_score != null ? `${scan.psi_score}/100` : "—";
  const findings = Array.isArray(scan.findings_json) ? scan.findings_json : [];
  const psiOk = !!scan.psi_ok;

  return (
    <div className="wrap">
      <section className="risk-dashboard" aria-label="Compliance and revenue impact">
        <div className="risk-alert" role="alert">
          <p className="risk-alert-eyebrow">ADA Compliance Audit Status</p>
          <p className="risk-alert-value">{risk}</p>
          <p className="risk-alert-sub">
            Public-page signals for {company} — Google PSI mobile lab, not legal advice.
          </p>
        </div>
        <div className="roi-card">
          <p className="roi-label">Estimated Monthly Recoverable Revenue</p>
          <p className="roi-value">{roi}</p>
          <p className="roi-note">Modeled from public-page friction. Risk Shield monitors weekly.</p>
        </div>
      </section>

      <div className="card">
        <div className="pill">Risk Shield · live preview</div>
        <h1>
          Hi {first}, your {company} accessibility risk preview
        </h1>
        {website ? (
          <p className="muted">
            URL reviewed:{" "}
            <a href={website} style={{ color: "#58a6ff" }}>
              {website}
            </a>
          </p>
        ) : null}
        {psiOk && scan.psi_score != null ? (
          <p className="muted">
            <strong>Google PageSpeed (mobile lab):</strong> Performance {scan.psi_score}/100
            {scan.psi_acc_score != null ? `, Accessibility ${scan.psi_acc_score}/100` : ""}. Not legal
            advice.
          </p>
        ) : (
          <p className="muted">
            <em>Preview scan did not complete live. Risk Shield re-runs the full audit weekly.</em>
          </p>
        )}
        {psiOk ? (
          <p>
            <strong>Attention priority:</strong> {score} (composite from lab scores).
          </p>
        ) : null}
        <p>
          Partial sample of the same pipeline that powers <strong>weekly Risk Shield monitoring</strong>.
        </p>
      </div>

      <div className="card teaser">
        <h2>Findings on your URL</h2>
        <ul className="list">
          {findings.slice(0, 3).map((item, idx) => (
            <li key={idx} className={psiOk && idx > 0 ? "blur" : undefined}>
              {item}
            </li>
          ))}
          {!findings.length ? (
            <li>
              {psiOk
                ? "Lab scan completed — additional priorities unlock with Risk Shield monitoring."
                : "Live scan pending — Risk Shield re-runs PageSpeed weekly on your URL."}
            </li>
          ) : null}
        </ul>
        <p className="muted">
          First finding shown in full; remaining priorities unlock with Risk Shield ($197/mo).
        </p>
      </div>

      <div className="card">
        <h2>What Risk Shield adds (weekly)</h2>
        <ul className="list">
          <li>Weekly automated WCAG/PSI rescans on your domain</li>
          <li>Dated compliance reports for good-faith remediation records</li>
          <li>P1 / P2 / P3 fix list your dev team can execute</li>
        </ul>
        <p className="money">$197/mo — cancel anytime. Annual $1,970/yr (2 months free).</p>
        <p>
          <a className="cta" href={offer}>
            Start weekly risk monitoring — $197/mo
          </a>
        </p>
        <p className="subcta">
          <a href={SAMPLE}>Or view the sample monitoring report first</a>
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
