# GitHub / Git notları

Bu repo GitHub MCP ile oluşturuldu: **mahmutkaracan48/karacan-analytics-site**.

Yerelde klonlamak için:

```bash
git clone https://github.com/mahmutkaracan48/karacan-analytics-site.git
cd karacan-analytics-site
```

## Stripe → sıra

1. Vercel'de bu repoyu import et, **Production** deploy al.
2. `karacan-analytics.com` DNS'ini Vercel'e bağla; site **HTTPS** ile açılsın.
3. Stripe'da işletme URL'si: `https://karacan-analytics.com` → Payment Link oluştur.
4. `index.html` içinde `stripeUrl` → commit + push.
