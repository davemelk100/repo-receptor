# repo-receptor — app

SvelteKit 2 + Svelte 5 + Tailwind 4 + Supabase. Mobile-first.

## Setup

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Fill in `.env.local` with Supabase keys and GitHub OAuth creds. See the root blueprint for the full env list.

## What's working

- Feed page (`/`) with mock repos, working search and filter chips
- Repo detail (`/repo/[owner]/[repo]`) with segmented tabs and commit list
- Sign-in stub (`/signin`) with a wired-up `supabase.auth.signInWithOAuth` call
- Tailwind 4 with design tokens in `src/app.css`
- PWA manifest via `@vite-pwa/sveltekit`
- Viewport and theme-color meta in `src/app.html`

## What's stubbed

- Supabase is imported but no schema is applied yet — see the root blueprint for the `profiles` table SQL
- No real GitHub API calls — data comes from `src/lib/data/mock.js`
- No auth guard on routes yet
- No background sync edge function
- No real tests

## Project structure

```
src/
  lib/
    data/mock.js       # placeholder repos + commits
    supabase.js        # client-side Supabase instance
  routes/
    +layout.svelte     # imports app.css
    +page.svelte       # feed
    repo/[owner]/[repo]/+page.svelte   # detail
    signin/+page.svelte                # OAuth entry
  app.html             # viewport, theme-color
  app.css              # Tailwind + design tokens
```

## Next steps

1. Create Supabase project, apply schema from the blueprint, paste keys into `.env.local`
2. Configure GitHub OAuth in Supabase dashboard
3. Replace `mockRepos` with a real `+page.server.js` load function that hits Supabase
4. Write an edge function that syncs each user's repos every 15 min
5. Add the filter bottom sheet as a route or component (see `/prototypes` for the design)
6. Add the diff view route at `/repo/[owner]/[repo]/commit/[sha]`
