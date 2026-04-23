<script>
  import { mockRepos, statusMeta } from '$lib/data/mock.js';

  let { data } = $props();

  const loading = $derived(data.repos === undefined);
  const allRepos = $derived(data.repos ?? mockRepos);

  let query = $state('');
  let activeChip = $state('all');

  const chips = [
    { id: 'all', label: 'All' },
    { id: 'failing', label: 'Failing' },
    { id: 'deployed', label: 'Deployed' },
    { id: 'issues', label: 'Issues' },
    { id: 'archived', label: 'Archived' }
  ];

  const filtered = $derived.by(() => {
    let r = allRepos;
    if (activeChip !== 'all') {
      r = r.filter(repo => repo.status === activeChip);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      r = r.filter(repo =>
        repo.name.toLowerCase().includes(q) ||
        repo.lastCommitMessage.toLowerCase().includes(q)
      );
    }
    return r;
  });

  const stats = $derived({
    total: allRepos.length,
    deployed: allRepos.filter(r => r.status === 'deployed').length,
    failing: allRepos.filter(r => r.status === 'failing').length
  });
</script>

<svelte:head>
  <title>Feed · repo-receptor</title>
</svelte:head>

<div class="flex h-dvh flex-col bg-white">
  <!-- Header -->
  <header class="flex items-center justify-between border-b border-black/5 px-4 py-3">
    <div class="flex items-center gap-2">
      <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="#F1EFE8">
          <path d="M8 1.5a6.5 6.5 0 0 0-2.05 12.66c.32.06.44-.14.44-.31v-1.1c-1.8.39-2.18-.87-2.18-.87-.3-.74-.72-.94-.72-.94-.58-.4.04-.39.04-.39.65.04 1 .67 1 .67.58.99 1.52.7 1.89.54.06-.42.23-.71.41-.87-1.44-.16-2.96-.72-2.96-3.2 0-.71.25-1.29.67-1.74-.07-.17-.29-.83.06-1.73 0 0 .54-.17 1.78.67.52-.14 1.07-.22 1.62-.22.55 0 1.1.08 1.62.22 1.23-.84 1.78-.67 1.78-.67.35.9.13 1.56.06 1.73.42.45.67 1.03.67 1.74 0 2.49-1.52 3.03-2.97 3.2.23.2.44.6.44 1.22v1.81c0 .18.12.38.44.31A6.5 6.5 0 0 0 8 1.5z"/>
        </svg>
      </div>
      <h1 class="m-0 text-[17px] font-medium -tracking-[0.3px]">repo-receptor</h1>
    </div>
    <a href="/profile" class="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEEDFE] text-xs font-medium text-[#3C3489]">
      DM
    </a>
  </header>

  <!-- Scroll area -->
  <div class="flex-1 overflow-y-auto">
    <!-- Search -->
    <div class="px-4 pt-3">
      <input
        type="search"
        inputmode="search"
        autocomplete="off"
        placeholder="Search repos, commits, PRs…"
        bind:value={query}
        class="w-full rounded-[10px] border border-black/5 bg-[#F6F5F1] px-3.5 py-2.5 text-sm outline-none focus:border-black/20"
      />
    </div>

    <!-- Chips -->
    <div class="no-scrollbar flex gap-2 overflow-x-auto px-4 py-3">
      {#each chips as chip}
        <button
          onclick={() => activeChip = chip.id}
          class="min-h-[32px] flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors
            {activeChip === chip.id
              ? 'border-neutral-900 bg-neutral-900 text-white'
              : 'border-black/5 bg-transparent text-[#5F5E5A]'}"
        >
          {chip.label}
        </button>
      {/each}
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-3 gap-2 px-4 pb-4">
      <div class="rounded-[10px] bg-[#F6F5F1] p-3">
        <p class="mb-1 text-[11px] text-[#5F5E5A]">Repos</p>
        <p class="m-0 text-lg font-medium -tracking-[0.3px]">{stats.total}</p>
      </div>
      <div class="rounded-[10px] bg-[#F6F5F1] p-3">
        <p class="mb-1 text-[11px] text-[#5F5E5A]">Deployed</p>
        <p class="m-0 text-lg font-medium -tracking-[0.3px]">{stats.deployed}</p>
      </div>
      <div class="rounded-[10px] bg-[#F6F5F1] p-3">
        <p class="mb-1 text-[11px] text-[#5F5E5A]">Failing</p>
        <p class="m-0 text-lg font-medium -tracking-[0.3px]" style="color: {stats.failing > 0 ? '#A32D2D' : 'inherit'}">{stats.failing}</p>
      </div>
    </div>

    <!-- Feed header -->
    <div class="flex items-center justify-between px-4 pb-2 pt-1">
      <p class="m-0 text-[11px] font-medium uppercase tracking-wider text-[#5F5E5A]">Production feed</p>
      <span class="text-[11px] text-[#888780]">Pull to refresh</span>
    </div>

    <!-- Feed -->
    <div class="px-4">
      {#if loading}
        {#each Array(4) as _}
          <div class="mb-2.5 rounded-xl border border-black/5 bg-white p-3">
            <div class="mb-2 flex items-start justify-between gap-2">
              <div class="min-w-0">
                <div class="skeleton h-4 w-32 rounded"></div>
                <div class="skeleton mt-1.5 h-3 w-20 rounded"></div>
              </div>
              <div class="skeleton h-5 w-16 rounded-full"></div>
            </div>
            <div class="skeleton mb-2.5 h-3 w-3/4 rounded"></div>
            <div class="flex items-center gap-3 border-t border-black/5 pt-2">
              <div class="skeleton h-3 w-16 rounded"></div>
              <div class="skeleton h-3 w-8 rounded"></div>
              <div class="skeleton ml-auto h-3 w-12 rounded"></div>
            </div>
          </div>
        {/each}
      {:else}
        {#each filtered as repo (repo.id)}
          {@const meta = statusMeta[repo.status]}
          <a
            href="/repo/{repo.owner}/{repo.name}"
            class="mb-2.5 block rounded-xl border border-black/5 bg-white p-3 no-underline"
          >
            <div class="mb-2 flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="m-0 font-mono text-sm font-medium">{repo.name}</p>
                <p class="mt-0.5 font-mono text-[11px] text-[#888780]">{repo.owner}</p>
              </div>
              <span
                class="inline-flex flex-shrink-0 items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] font-medium"
                style="background: {meta.bg}; color: {meta.fg}"
              >
                <span class="inline-block h-1.5 w-1.5 rounded-full" style="background: {meta.dot}"></span>
                {meta.label}
              </span>
            </div>
            <p class="m-0 mb-2.5 text-xs leading-relaxed text-[#5F5E5A]">
              {repo.lastCommitMessage}
              <span class="ml-1 rounded bg-[#F6F5F1] px-1.5 py-px font-mono text-[11px] text-[#888780]">{repo.lastCommitSha}</span>
            </p>
            <div class="flex items-center gap-3 border-t border-black/5 pt-2">
              <span class="flex items-center gap-1 text-[11px] text-[#5F5E5A]">
                <span class="inline-block h-2 w-2 rounded-full" style="background: {repo.languageColor}"></span>
                {repo.language}
              </span>
              <span class="text-[11px] text-[#5F5E5A]">{repo.lastCommitAt}</span>
              <span class="ml-auto font-mono text-[11px] text-[#888780]">{repo.branch}</span>
            </div>
          </a>
        {:else}
          <div class="rounded-xl border border-black/5 bg-[#F6F5F1] p-8 text-center">
            <p class="m-0 mb-1 text-sm font-medium">No matches</p>
            <p class="m-0 text-xs text-[#5F5E5A]">Try clearing the filter or search.</p>
          </div>
        {/each}
      {/if}
      <div class="h-3"></div>
    </div>
  </div>

  <!-- Bottom tab bar -->
  <nav class="flex justify-around border-t border-black/5 bg-white pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2">
    <a href="/" class="flex min-h-[44px] min-w-[60px] flex-col items-center gap-1 px-4 py-1.5 text-neutral-900 no-underline">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 10 10 3l7 7v7h-5v-5H8v5H3z"/></svg>
      <span class="text-[10px] font-medium">Feed</span>
    </a>
    <a href="/apps" class="flex min-h-[44px] min-w-[60px] flex-col items-center gap-1 px-4 py-1.5 text-[#888780] no-underline">
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
  .no-scrollbar::-webkit-scrollbar { display: none; }
  .no-scrollbar { scrollbar-width: none; }
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
