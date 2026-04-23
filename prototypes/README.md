# Prototypes

Static HTML mockups of the mobile-first UI. No build step.

## View locally

```bash
open index.html
```

Or serve it with anything:

```bash
npx serve .
# or
python3 -m http.server 8000
```

## Deploy

The folder is self-contained, so any static host works:

- **GitHub Pages** — set Pages source to `/prototypes` on the `main` branch
- **Netlify** — drag and drop `prototypes/` onto the Netlify dashboard
- **Vercel** — `vercel` inside this folder

## Screens

Flip between screens using the buttons at the top of `index.html`:

- **Feed** — main dashboard, status cards, filter chips, repo cards with pull-to-refresh
- **Empty** — onboarding / GitHub OAuth prompt, read-only scope explanation
- **Filter** — bottom sheet with status, language, and sort controls
- **Detail** — single repo view with hero, stats, segmented control, commit list, CI log
- **Diff** — commit diff view with collapsible file hunks

## Design notes

- 360px baseline width, scales up for larger screens
- 44px minimum touch targets throughout
- Safe-area inset respected on bottom nav and action bars
- Status uses color + icon + text (works for color-blind users)
- No hover-only interactions
- System font stack so it feels native on iOS and Android
