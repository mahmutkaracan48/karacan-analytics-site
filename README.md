# karacan-analytics.com — vitrin (statik)

Profesyonel tek sayfa + Privacy + Terms. **Build yok:** Vercel / Cloudflare Pages / Netlify ile doğrudan deploy.

**Repo:** https://github.com/mahmutkaracan48/karacan-analytics-site

**Stripe sırası:** Önce siteyi **canlı URL** ile yayınla (Vercel + `karacan-analytics.com`) → Stripe işletme bilgisinde bu URL → Payment Link → sonra `index.html` içindeki `stripeUrl`.

## Stripe ile bağlama

1. Stripe Dashboard → **Payment links** → ürün / fiyat oluştur → linki kopyala.
2. `index.html` içinde `<script>` bloğunda `var stripeUrl = "";` satırına Payment Link URL'ini yapıştır veya `id="stripe-pay"` anchor'ın `href`'ini değiştir.
3. Stripe'da **Business settings → Public business information** içinde bu site URL'sini göster.

## Vercel deploy

1. [vercel.com](https://vercel.com) → New Project → Import **mahmutkaracan48/karacan-analytics-site**.
2. Framework: **Other** (static). Root: repo kökü.
3. **Settings → Domains** → `karacan-analytics.com` (ve isteğe bağlı `www`).
4. DNS sağlayıcısında Vercel'in verdiği kayıtları ekle.

## Senin düzenlemen gerekenler

- `hello@karacan-analytics.com` — gerçek iletişim e-postası.
- Footer'daki **NJ iş adresi** — Apex `Compliance_Config` ile aynı olmalı.
- `privacy.html` / `terms.html` — avukat gözden geçirmesi.

Manuel Git push için: [DEPLOY_GITHUB.md](./DEPLOY_GITHUB.md)
