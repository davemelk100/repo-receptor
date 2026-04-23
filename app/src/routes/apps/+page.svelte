<script>
  import { mockRepos, statusMeta } from '$lib/data/mock.js';

  let { data } = $props();

  const loading = $derived(data.repos === undefined);
  const allRepos = $derived(data.repos ?? mockRepos);

  let query = $state('');

  const filtered = $derived.by(() => {
    if (!query.trim()) return allRepos;
    const q = query.toLowerCase();
    return allRepos.filter(repo =>
      repo.name.toLowerCase().includes(q) ||
      repo.owner.toLowerCase().includes(q) ||
      repo.description.toLowerCase().includes(q)
    );
  });
</script>

<svelte:head>
  <title>Apps · repo-receptor</title>
</svelte:head>

<div class="flex h-dvh flex-col bg-white">
  <header class="border-b border-black/5 px-4 py-3">
    <h1 class="m-0 text-[17px] font-medium -tracking-[0.3px]">Apps</h1>
    <p class="m-0 mt-0.5 text-[11px] text-[#888780]">{allRepos.length} repos connected</p>
  </header>

  <div class="flex-1 overflow-y-auto">
    <!-- Search -->
    <div class="px-4 pt-3 pb-2">
      <input
        type="search"
        inputmode="search"
        autocomplete="off"
        placeholder="Filter repos…"
        bind:value={query}
        class="w-full rounded-[10px] border border-black/5 bg-[#F6F5F1] px-3.5 py-2.5 text-sm outline-none focus:border-black/20"
      />
    </div>

    <!-- Repo list -->
    <div class="px-4">
      {#if loading}
        {#each Array(5) as _}
          <div class="flex items-center gap-3 border-b border-black/5 py-3">
            <div class="skeleton h-9 w-9 flex-shrink-0 rounded-lg"></div>
            <div class="min-w-0 flex-1">
              <div class="skeleton h-4 w-36 rounded"></div>
              <div class="skeleton mt-1.5 h-3 w-48 rounded"></div>
              <div class="mt-1.5 flex gap-3">
                <div class="skeleton h-3 w-14 rounded"></div>
                <div class="skeleton h-3 w-16 rounded"></div>
                <div class="skeleton h-3 w-10 rounded"></div>
              </div>
            </div>
          </div>
        {/each}
      {:else}
        {#each filtered as repo (repo.id)}
          {@const meta = statusMeta[repo.status]}
          <a
            href="/repo/{repo.owner}/{repo.name}"
            class="flex items-center gap-3 border-b border-black/5 py-3 no-underline"
          >
            <div class="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-[#F6F5F1]">
              <span class="inline-block h-2.5 w-2.5 rounded-full" style="background: {repo.languageColor}"></span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <p class="m-0 truncate font-mono text-sm font-medium">{repo.name}</p>
                <span
                  class="inline-flex flex-shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-medium"
                  style="background: {meta.bg}; color: {meta.fg}"
                >
                  <span class="inline-block h-1.5 w-1.5 rounded-full" style="background: {meta.dot}"></span>
                  {meta.label}
                </span>
              </div>
              <p class="m-0 mt-0.5 truncate text-xs text-[#5F5E5A]">{repo.description}</p>
              <div class="mt-1 flex items-center gap-3 text-[11px] text-[#888780]">
                <span>{repo.language}</span>
                <span>{repo.owner}</span>
                <span class="font-mono">{repo.branch}</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#888780" stroke-width="1.5" class="flex-shrink-0"><path d="M6 4l4 4-4 4"/></svg>
          </a>
        {:else}
          <div class="rounded-xl border border-black/5 bg-[#F6F5F1] p-8 text-center mt-2">
            <p class="m-0 mb-1 text-sm font-medium">No matches</p>
            <p class="m-0 text-xs text-[#5F5E5A]">Try a different search term.</p>
          </div>
        {/each}
      {/if}
    </div>
  </div>

  <!-- Bottom tab bar -->
  <nav class="flex justify-around border-t border-black/5 bg-white pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2">
    <a href="/" class="flex min-h-[44px] min-w-[60px] flex-col items-center gap-1 px-4 py-1.5 text-[#888780] no-underline">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 10 10 3l7 7v7h-5v-5H8v5H3z"/></svg>
      <span class="text-[10px] font-medium">Feed</span>
    </a>
    <a href="/apps" class="flex min-h-[44px] min-w-[60px] flex-col items-center gap-1 px-4 py-1.5 text-neutral-900 no-underline">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="11" y="3" width="6" height="6" rx="1"/><rect x="3" y="11" width="6" height="6" rx="1"/><rect x="11" y="11" width="6" height="6" rx="1"/></svg>
      <span class="text-[10px] font-medium">Apps</span>
    </a>
    <a href="/stats" class="flex min-h-[44px] min-w-[60px] flex-col items-center gap-1 px-4 py-1.5 text-[#888780] no-underline">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 16l4-4 3 3 7-7"/><path d="M13 8h4v4"/></svg>
      <span class="text-[10px] font-medium">Stats</span>
    </a>
    <a href="/profile" class="flex min-h-[44px] min-w-[60px] flex-col items-center gap-1 px-4 py-1.5 text-[#888780] no-underline">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="7" r="3"/><path d="M3 17c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>
      <span class="text-[10px] font-medium">Profile</span>
    </a>
  </nav>
</div>

<style>
  .skeleton {
    background: linear-gradient(90deg, #F6F5F1 25%, #EEEDEA 50%, #F6F5F1 75%);
    background-size: 200% 100%;
    animation: shimmer 1.2s ease-in-out infinite;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
</style>
