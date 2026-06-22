/** Live Stripe Payment Links — SSOT mirror of assets/checkout-config.js */
export const CHECKOUT = {
  site: "https://karacan-analytics.com",
  activation499: "https://buy.stripe.com/9B6bJ24Jke3ngox0TS0VO05",
  starterMonthly: "https://buy.stripe.com/00wfZi0t42kF0pzbyw0VO02",
  starterAnnual: "https://buy.stripe.com/6oU8wQ7Vwf7r4FPfOM0VO03",
  proMonthly: "https://buy.stripe.com/eVqaEY4Jk0cxdcldGE0VO04",
  supportEmail: "contact@karacan-analytics.com",
} as const;

export function appendCheckoutParams(
  base: string,
  scan: {
    email?: string | null;
    company_name?: string | null;
    website?: string | null;
    preview_slug?: string | null;
    state?: string | null;
  },
): string {
  try {
    const u = new URL(base);
    const email = String(scan.email || "").trim().toLowerCase();
    if (email) {
      u.searchParams.set("prefilled_email", email);
      u.searchParams.set("email", email);
    }
    const company = String(scan.company_name || "").trim();
    if (company) u.searchParams.set("company", company);
    const website = String(scan.website || "").trim();
    if (website) u.searchParams.set("website", website);
    const slug = String(scan.preview_slug || "").trim().toLowerCase();
    if (slug) u.searchParams.set("client_reference_id", slug);
    const state = String(scan.state || "").trim();
    if (state) u.searchParams.set("state", state);
    return u.toString();
  } catch {
    return base;
  }
}

export function offerUrls(scan: {
  offer_url?: string | null;
  email?: string | null;
  company_name?: string | null;
  website?: string | null;
  preview_slug?: string | null;
  state?: string | null;
}) {
  const stored = String(scan.offer_url || "").trim();
  const legacyOffer = stored.includes("5kQ8wQ");
  const monthlyBase = stored && !legacyOffer ? stored : CHECKOUT.starterMonthly;
  return {
    activation: appendCheckoutParams(CHECKOUT.activation499, scan),
    monthly: appendCheckoutParams(monthlyBase, scan),
    annual: appendCheckoutParams(CHECKOUT.starterAnnual, scan),
    pro: appendCheckoutParams(CHECKOUT.proMonthly, scan),
  };
}
