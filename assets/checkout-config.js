/**
 * Single source of truth for live Stripe Payment Link (karacan-analytics.com).
 * After creating a new Payment Link in Stripe Dashboard (Live mode), paste the full URL here
 * and deploy. index.html + preview pages load this file.
 */
window.KA_CHECKOUT = {
  /** Primary marketing URL (emails + footer). GitHub Pages mirror is fallback only. */
  siteBaseUrl: "https://karacan-analytics.com",
  stripeSnapshotUrl: "https://buy.stripe.com/5kQ8wQ1x89N7fkt0TS0VO01",
  supportEmail: "contact@karacan-analytics.com",
  deliverySlaText: "12-24 hours after payment and scope confirmation",
  /**
   * VSL / overview: YouTube watch or embed URL, or direct HTTPS .mp4 (e.g. Higgsfield export to CDN).
   * Example: "https://www.youtube.com/embed/VIDEO_ID" or unlisted watch URL (auto-normalized).
   */
  overviewVideoUrl: "",
};
