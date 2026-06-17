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

  loadClarity();
})();
