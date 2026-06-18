(function () {
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  var cfg = window.KA_CHECKOUT || {};
  var email = (cfg.supportEmail || "contact@karacan-analytics.com").trim();
  var mail = "mailto:" + email;

  document.querySelectorAll("[data-support-email]").forEach(function (el) {
    el.href = mail;
    if (el.hasAttribute("data-support-email-text")) {
      el.textContent = email;
    }
  });
})();
