# Preview hook video (MP4)

Personalized cold-email **preview pages** (`/previews/*.html`) embed a short hero video at the top when built with `ka_apex preview-build` / `build_send_ready.py` (see `apex_engine/python/ka_apex/preview_builder.py`).

## Deploy

1. Export your Marketing Studio (or other) clip as **MP4**, H.264 + AAC, reasonable bitrate (e.g. under ~15 MB for a ~15 s clip).
2. Name the file **`accessibility-snapshot-hook.mp4`** and place it in **this folder** (`media/`).
3. Commit and push; Vercel will serve it at:

   `https://karacan-analytics.com/media/accessibility-snapshot-hook.mp4`

4. Rebuild preview HTML (`preview_bundle`) and copy `previews/*.html` into this repo’s `previews/` as you already do for harvests.

## Override URL

Set env **`PREVIEW_HOOK_VIDEO_URL`** to any HTTPS MP4, or pass `--preview-hook-video-url` / `--hook-video-url` on CLI. Use **`--no-preview-hook-video`** / **`--no-hook-video`** to omit the block entirely.
