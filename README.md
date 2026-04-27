# karacan-analytics.com — vitrin (statik)

Profesyonel site + Privacy + Terms. **Build yok:** Vercel / Cloudflare Pages / Netlify ile doğrudan deploy.

**Repo:** https://github.com/mahmutkaracan48/karacan-analytics-site

## Conversion odaklı ana sayfa (Snapshot + Monitoring + Analytics)

`index.html` artık üç satırı birlikte taşır:

1. **Accessibility Risk Snapshot** (`#snapshot`) — Stripe Payment Link: `KA_STRIPE_SNAPSHOT` (script bloğu). Boşsa butonlar `mailto:contact@karacan-analytics.com` ile Stripe linki ister.
2. **Monitoring (MRR)** — tabloda `mailto:` ile başlat; Stripe Subscription linkleri hazır olunca aynı hücrelere yapıştır.
3. **Analytics sprint** — mevcut Payment Link: `KA_STRIPE_ANALYTICS_SPRINT`.

## VSL (video) embed

YouTube **unlisted** (veya Wistia/Vimeo) embed URL’ini `index.html` sonundaki script’te ayarla:

```js
var KA_VSL_EMBED_URL = "https://www.youtube.com/embed/VIDEO_ID";
```

Boş bırakılırsa sayfada yer tutucu metin görünür.

## Stripe sırası

1. Siteyi canlı URL ile yayınla.
2. Stripe Dashboard → **Payment links** → Snapshot ürünü için link → `KA_STRIPE_SNAPSHOT`.
3. İşletme bilgisinde bu domain gösterilsin.

## Vercel deploy

1. [vercel.com](https://vercel.com) → Import **mahmutkaracan48/karacan-analytics-site**.
2. Framework: **Other** (static).
3. **Domains** → `karacan-analytics.com`.

## İletişim e-postası

Varsayılan: **contact@karacan-analytics.com** — tüm `mailto:` ve footer ile uyumlu tut.

Manuel Git: [DEPLOY_GITHUB.md](./DEPLOY_GITHUB.md)
