/**
 * Risk Shield — live Stripe subscription Payment Links (Karacan Analytics).
 * Account: Karacan LLC (acct_1Rj5buKNHfNp5Yn4) — LIVE mode.
 */
window.KA_CHECKOUT = {
  siteBaseUrl: "https://karacan-analytics.com",
  productName: "Risk Shield",
  /** Primary outbound CTA — $197/mo */
  stripeStarterMonthlyUrl: "https://buy.stripe.com/00wfZi0t42kF0pzbyw0VO02",
  /** Annual prepay — $1,970/yr */
  stripeStarterAnnualUrl: "https://buy.stripe.com/6oU8wQ7Vwf7r4FPfOM0VO03",
  /** Pro tier — $397/mo */
  stripeProMonthlyUrl: "https://buy.stripe.com/eVqaEY4Jk0cxdcldGE0VO04",
  defaultPlan: "starter_monthly",
  /** @deprecated one-time Snapshot — do not use in UI */
  legacySnapshotUrl: "https://buy.stripe.com/5kQ8wQ1x89N7fkt0TS0VO01",
  supportEmail: "contact@karacan-analytics.com",
  deliverySlaText: "Weekly automated scans; first report within 24 hours of signup",
  ctaStarterMonthly: "Start weekly risk monitoring — $197/mo",
  ctaStarterAnnual: "Start annual risk monitoring — $1,970/yr (2 months free)",
  ctaProMonthly: "Start Pro monitoring — $397/mo",
};
