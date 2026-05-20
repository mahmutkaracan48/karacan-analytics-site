(function () {
  var y = document.getElementById("y");
  if (y) y.textContent = String(new Date().getFullYear());

  var cfg = window.KA_CHECKOUT || {};
  var base = (cfg.siteBaseUrl || "https://karacan-analytics.com").replace(/\/$/, "");
  var email = (cfg.supportEmail || "contact@karacan-analytics.com").trim();
  var mail = "mailto:" + email;
  var stripeUrl = (cfg.stripeSnapshotUrl || "https://buy.stripe.com/5kQ8wQ1x89N7fkt0TS0VO01").trim();

  ["cta-email-hero", "cta-email-story", "contact-inline", "contact-inline-pay"].forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (id === "cta-email-hero") el.href = mail + "?subject=Snapshot%20question";
    else if (id === "cta-email-story") el.href = mail + "?subject=Snapshot%20%E2%80%94%20invoice%20link";
    else el.href = mail;
    if (id === "contact-inline" || id === "contact-inline-pay") el.textContent = email;
  });

  var hsl = document.getElementById("hero-site-link");
  if (hsl) {
    hsl.innerHTML =
      'Same offer on <a href="' +
      base +
      '/#hero-atf">karacan-analytics.com</a> — fixed-scope Accessibility Risk Snapshot.';
  }

  if (stripeUrl) {
    document.querySelectorAll(".ka-stripe-link, .ka-stripe-cta").forEach(function (el) {
      if (el.id === "cta-email-hero" || el.id === "cta-email-story") return;
      el.href = stripeUrl;
      if (el.tagName === "A" && el.classList.contains("ka-stripe-link")) {
        el.setAttribute("rel", "noopener noreferrer");
      }
    });
  }

  function loadClarity() {
    (function (c, l, a, r, i) {
      c[a] =
        c[a] ||
        function () {
          (c[a].q = c[a].q || []).push(arguments);
        };
      var t = l.createElement(r);
      t.async = true;
      t.src = "https://www.clarity.ms/tag/" + i;
      l.head.appendChild(t);
    })(window, document, "clarity", "script", "wsxqx462hv");
  }

  if ("requestIdleCallback" in window) {
    requestIdleCallback(loadClarity, { timeout: 4000 });
  } else {
    window.addEventListener("load", function () {
      setTimeout(loadClarity, 2000);
    });
  }
})();
