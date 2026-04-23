# repo-receptor

Track the apps you have in production via a GitHub feed from your own repos.

## What's in this repo

This repo holds two things side by side:

- **`/prototypes`** — static HTML mockups of the mobile-first UI. Four screens: feed, empty state / onboarding, filter sheet, repo detail, commit diff. No build step, no dependencies. Open `prototypes/index.html` in a browser.
- **`/app`** — the SvelteKit 2 + Svelte 5 scaffold where the real app lives. Tailwind 4, Supabase client, GitHub API wiring, PWA manifest. Run `pnpm install && pnpm dev` inside `/app`.

The prototypes are the design spec. The app is where the design gets implemented. Keep them both until the app catches up.

## Getting started

### Prototypes

```bash
cd prototypes
open index.html
```

Or push the `/prototypes` folder to GitHub Pages / Netlify / Vercel for a shareable link.

### App

```bash
cd app
pnpm install
cp .env.example .env.local
pnpm dev
```

Fill in Supabase and GitHub OAuth credentials in `.env.local`. See `app/README.md` for full setup.

## Stack

SvelteKit 2, Svelte 5 runes, TailwindCSS 4, Supabase (Postgres + Auth + Storage), GitHub REST API, Vercel or Cloudflare Pages for hosting.

## Roadmap

- [x] Mobile-first UI mockups (prototypes)
- [x] SvelteKit project scaffold
- [ ] GitHub OAuth via Supabase Auth
- [ ] Repo sync via Edge Function (15 min interval)
- [ ] Feed + detail + diff routes wired to real data
- [ ] PWA install and offline shell
- [ ] Deploy to production

## License

MIT
