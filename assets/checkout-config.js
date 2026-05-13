/**
 * Single source of truth for live Stripe Payment Link (karacan-analytics.com).
 * After creating a new Payment Link in Stripe Dashboard (Live mode), paste the full URL here
 * and deploy. index.html + preview pages load this file.
 */
window.KA_CHECKOUT = {
  stripeSnapshotUrl: "https://buy.stripe.com/5kQ8wQ1x89N7fkt0TS0VO01",
  supportEmail: "contact@karacan-analytics.com",
  deliverySlaText: "12-24 hours after payment and scope confirmation",
  /** Optional: YouTube embed URL or direct .mp4 HTTPS URL for the homepage "90-second overview" block. */
  overviewVideoUrl: "",
};
