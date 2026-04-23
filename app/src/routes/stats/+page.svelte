<script>
  let { data } = $props();

  const stats = $derived(data.stats);
  const activity = $derived(data.activity ?? []);
  const maxActivity = $derived(Math.max(...activity.map(d => d.count), 1));

  function barHeight(count) {
    return Math.max(4, (count / maxActivity) * 80);
  }

  function dayLabel(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2);
  }

  function dateLabel(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
</script>

<svelte:head>
  <title>Stats · repo-receptor</title>
</svelte:head>

<div class="flex h-dvh flex-col bg-white">
  <header class="border-b border-black/5 px-4 py-3">
    <h1 class="m-0 text-[17px] font-medium -tracking-[0.3px]">Stats</h1>
  </header>

  <div class="flex-1 overflow-y-auto">
    {#if stats}
      <!-- Summary cards -->
      <div class="grid grid-cols-2 gap-2 px-4 pt-4">
        <div class="rounded-[10px] bg-[#F6F5F1] p-3">
          <p class="m-0 mb-1 text-[11px] text-[#5F5E5A]">Repos</p>
          <p class="m-0 text-xl font-medium -tracking-[0.3px]">{stats.totalRepos}</p>
        </div>
        <div class="rounded-[10px] bg-[#F6F5F1] p-3">
          <p class="m-0 mb-1 text-[11px] text-[#5F5E5A]">Stars</p>
          <p class="m-0 text-xl font-medium -tracking-[0.3px]">{stats.totalStars}</p>
        </div>
        <div class="rounded-[10px] bg-[#F6F5F1] p-3">
          <p class="m-0 mb-1 text-[11px] text-[#5F5E5A]">Open issues</p>
          <p class="m-0 text-xl font-medium -tracking-[0.3px]">{stats.totalIssues}</p>
        </div>
        <div class="rounded-[10px] bg-[#F6F5F1] p-3">
          <p class="m-0 mb-1 text-[11px] text-[#5F5E5A]">Forks</p>
          <p class="m-0 text-xl font-medium -tracking-[0.3px]">{stats.totalForks}</p>
        </div>
      </div>

      <!-- Activity timeline -->
      {#if activity.length > 0}
        <div class="px-4 pt-5">
          <p class="m-0 mb-3 text-[11px] font-medium uppercase tracking-wider text-[#5F5E5A]">Activity (last 30 days)</p>
          <div class="rounded-xl border border-black/5 p-3">
            <div class="flex items-end gap-[3px]" style="height: 88px;">
              {#each activity as day}
                <div class="group relative flex-1">
                  <div
                    class="w-full rounded-sm transition-colors {day.count > 0 ? 'bg-neutral-900 hover:bg-neutral-700' : 'bg-[#EEEDEA]'}"
                    style="height: {barHeight(day.count)}px;"
                  ></div>
                  <div class="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 rounded bg-neutral-900 px-1.5 py-0.5 text-[10px] text-white whitespace-nowrap group-hover:block">
                    {dateLabel(day.date)}: {day.count}
                  </div>
                </div>
              {/each}
            </div>
            <div class="mt-1.5 flex justify-between text-[9px] text-[#888780]">
              <span>{dateLabel(activity[0]?.date)}</span>
              <span>{dateLabel(activity[activity.length - 1]?.date)}</span>
            </div>
          </div>
        </div>
      {/if}

      <!-- Language breakdown -->
      {#if stats.languageBreakdown.length > 0}
        <div class="px-4 pt-5">
          <p class="m-0 mb-3 text-[11px] font-medium uppercase tracking-wider text-[#5F5E5A]">Languages</p>
          <!-- Stacked bar -->
          <div class="mb-3 flex h-3 overflow-hidden rounded-full">
            {#each stats.languageBreakdown as lang}
              <div
                style="width: {(lang.count / stats.totalRepos) * 100}%; background: {lang.color};"
                class="min-w-[3px]"
              ></div>
            {/each}
          </div>
          <!-- Legend -->
          <div class="flex flex-wrap gap-x-4 gap-y-1.5">
            {#each stats.languageBreakdown as lang}
              <div class="flex items-center gap-1.5">
                <span class="inline-block h-2 w-2 rounded-full" style="background: {lang.color}"></span>
                <span class="text-xs text-[#5F5E5A]">{lang.name}</span>
                <span class="font-mono text-[11px] text-[#888780]">{lang.count}</span>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Most active repos -->
      {#if stats.mostActive.length > 0}
        <div class="px-4 pt-5 pb-4">
          <p class="m-0 mb-3 text-[11px] font-medium uppercase tracking-wider text-[#5F5E5A]">Most active</p>
          {#each stats.mostActive as repo, i}
            <a
              href="/repo/{repo.owner}/{repo.name}"
              class="flex items-center gap-3 border-b border-black/5 py-2.5 no-underline last:border-0"
            >
              <span class="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-[#F6F5F1] font-mono text-[11px] text-[#888780]">{i + 1}</span>
              <div class="min-w-0 flex-1">
                <p class="m-0 truncate font-mono text-sm font-medium">{repo.name}</p>
                <div class="mt-0.5 flex items-center gap-2 text-[11px] text-[#888780]">
                  <span class="flex items-center gap-1">
                    <span class="inline-block h-1.5 w-1.5 rounded-full" style="background: {repo.languageColor}"></span>
                    {repo.language}
                  </span>
                  <span>pushed {repo.pushedAt}</span>
                </div>
              </div>
              <div class="flex items-center gap-3 text-[11px] text-[#888780]">
                {#if repo.stars > 0}
                  <span class="flex items-center gap-0.5">
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25z"/></svg>
                    {repo.stars}
                  </span>
                {/if}
                {#if repo.issues > 0}
                  <span>{repo.issues} issues</span>
                {/if}
              </div>
            </a>
          {/each}
        </div>
      {/if}
    {:else}
      <!-- Not signed in -->
      <div class="flex flex-1 items-center justify-center p-8">
        <div class="text-center">
          <p class="m-0 mb-1 text-sm font-medium">No stats yet</p>
          <p class="m-0 text-xs text-[#5F5E5A]">Sign in with GitHub to see your repository analytics.</p>
          <a href="/signin" class="mt-4 inline-block rounded-full bg-neutral-900 px-5 py-2 text-xs font-medium text-white no-underline">Sign in</a>
        </div>
      </div>
    {/if}
  </div>

  <nav class="flex justify-around border-t border-black/5 bg-white pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2">
    <a href="/" class="flex min-h-[44px] min-w-[60px] flex-col items-center gap-1 px-4 py-1.5 text-[#888780] no-underline">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 10 10 3l7 7v7h-5v-5H8v5H3z"/></svg>
      <span class="text-[10px] font-medium">Feed</span>
    </a>
    <a href="/apps" class="flex min-h-[44px] min-w-[60px] flex-col items-center gap-1 px-4 py-1.5 text-[#888780] no-underline">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="6" height="6" rx="1"/><rect x="11" y="3" width="6" height="6" rx="1"/><rect x="3" y="11" width="6" height="6" rx="1"/><rect x="11" y="11" width="6" height="6" rx="1"/></svg>
      <span class="text-[10px] font-medium">Apps</span>
    </a>
    <a href="/stats" class="flex min-h-[44px] min-w-[60px] flex-col items-center gap-1 px-4 py-1.5 text-neutral-900 no-underline">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 16l4-4 3 3 7-7"/><path d="M13 8h4v4"/></svg>
      <span class="text-[10px] font-medium">Stats</span>
    </a>
    <a href="/profile" class="flex min-h-[44px] min-w-[60px] flex-col items-center gap-1 px-4 py-1.5 text-[#888780] no-underline">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="7" r="3"/><path d="M3 17c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>
      <span class="text-[10px] font-medium">Profile</span>
    </a>
  </nav>
</div>
