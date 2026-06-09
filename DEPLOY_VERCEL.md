# Vercel deploy — Next.js + Supabase previews

## What changed (SaaS pivot)

- **No more** GitHub API writes to `previews/*.html`
- **No more** Vercel rewrites to `raw.githubusercontent.com`
- Preview data: n8n → Supabase `scan_results` → site `/preview/[slug]`

## Prerequisites

1. Apply `supabase/migrations/002_preview_scans_saas.sql` in Supabase SQL editor
2. Vercel env vars:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deploy

1. [vercel.com](https://vercel.com) → **karacan-analytics-site** → Framework **Next.js**
2. Root: repo root (contains `package.json`, `app/`, `public/`)
3. Redeploy after env vars set

## Verify

- `https://karacan-analytics.com/` — Risk Shield landing
- `https://karacan-analytics.com/preview/{slug}` — 200 with scan row (after n8n upsert)
- Old `/previews/*.html` URLs — **404** (intentional; update Instantly/Airtable to new format)

## n8n side

```bash
python scripts/patch_supabase_preview_saas.py
```

Harvest `Publish Previews GitHub` and Enrich `Publish Preview` now upsert Supabase (node names unchanged).
