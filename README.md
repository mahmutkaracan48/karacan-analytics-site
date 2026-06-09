# karacan-analytics.com — Risk Shield (Next.js + Supabase)

Marketing pages (static in `public/`) + **dynamic previews** at `/preview/[slug]` loaded live from Supabase `scan_results`.

**Repo:** https://github.com/mahmutkaracan48/karacan-analytics-site

## Architecture

| Route | Source |
|-------|--------|
| `/` | `public/index.html` (middleware rewrite) |
| `/preview/{slug}` | Next.js `app/preview/[slug]` → Supabase anon read |
| `/assets/*`, `/reports/*` | `public/` |

**Deprecated:** GitHub push of `previews/*.html` — removed.

## Local dev

```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_SUPABASE_ANON_KEY from Supabase Dashboard → API → anon key

npm install
npm run dev
# http://localhost:3000/preview/{16-char-hex-slug}
```

## Vercel deploy

1. Import repo — Framework: **Next.js**
2. **Environment variables** (Production):
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://zxussxnggorcxkebcgjh.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon/public key
3. Domain: `karacan-analytics.com`

Migration `002_preview_scans_saas.sql` must be applied before previews resolve.

See also: `DEPLOY_VERCEL.md`
