<script>
  import { page } from '$app/state';
  import { mockRepos, mockCommits, statusMeta } from '$lib/data/mock.js';

  const repo = $derived(mockRepos.find(r =>
    r.owner === page.params.owner && r.name === page.params.repo
  ));
  const commits = $derived(repo ? (mockCommits[repo.id] ?? []) : []);
  const meta = $derived(repo ? statusMeta[repo.status] : null);

  let activeTab = $state('commits');
</script>

<svelte:head>
  <title>{repo?.name ?? 'Repo'} · repo-receptor</title>
</svelte:head>

{#if !repo}
  <div class="flex min-h-dvh items-center justify-center p-6">
    <div class="text-center">
      <p class="mb-2 text-base font-medium">Repo not found</p>
      <a href="/" class="text-sm text-[#5F5E5A] underline">Back to feed</a>
    </div>
  </div>
{:else}
  <div class="flex min-h-dvh flex-col bg-white">
    <!-- Nav -->
    <div class="flex items-center justify-between border-b border-black/5 px-2 py-1.5">
      <a href="/" class="flex min-h-[44px] min-w-[44px] items-center gap-0.5 px-1.5 text-sm no-underline text-neutral-900">
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 2L2 8l6 6"/></svg>
        <span>Feed</span>
      </a>
      <span class="font-mono text-sm font-medium">{repo.name}</span>
      <button class="flex min-h-[44px] min-w-[44px] items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="4" r="1.2"/><circle cx="9" cy="9" r="1.2"/><circle cx="9" cy="14" r="1.2"/></svg>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto">
      <!-- Hero -->
      <div class="px-4 pb-3.5 pt-4">
        <div class="flex items-start gap-3">
          <div class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] bg-[#FAECE7] font-mono text-base font-medium text-[#712B13]">
            {repo.name.slice(0, 2)}
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="m-0 font-mono text-lg font-medium -tracking-[0.3px]">{repo.name}</h1>
            <p class="mt-0.5 font-mono text-xs text-[#888780]">{repo.owner}</p>
          </div>
        </div>
        <p class="mt-3 text-xs leading-relaxed text-[#5F5E5A]">{repo.description}</p>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <span
            class="inline-flex items-center gap-1 rounded-full px-2 py-1 font-mono text-[11px] font-medium"
            style="background: {meta.bg}; color: {meta.fg}"
          >
            <span class="inline-block h-1.5 w-1.5 rounded-full" style="background: {meta.dot}"></span>
            {meta.label}
          </span>
          <span class="inline-flex items-center gap-1 rounded-full bg-[#F6F5F1] px-2 py-1 font-mono text-[11px] font-medium text-[#5F5E5A]">
            <span class="inline-block h-1.5 w-1.5 rounded-full" style="background: {repo.languageColor}"></span>
            {repo.language}
          </span>
          <span class="inline-flex items-center gap-1 rounded-full bg-[#F6F5F1] px-2 py-1 font-mono text-[11px] font-medium text-[#5F5E5A]">
            ★ {repo.stars}
          </span>
        </div>
      </div>

      <!-- Stat cards -->
      <div class="grid grid-cols-3 gap-2 px-4 pb-3.5">
        <div class="rounded-[10px] bg-[#F6F5F1] p-3">
          <p class="m-0 mb-1 text-[10px] uppercase tracking-wider text-[#5F5E5A]">Open issues</p>
          <p class="m-0 text-[17px] font-medium -tracking-[0.3px]" style="color: {repo.openIssues > 0 ? '#BA7517' : 'inherit'}">{repo.openIssues}</p>
        </div>
        <div class="rounded-[10px] bg-[#F6F5F1] p-3">
          <p class="m-0 mb-1 text-[10px] uppercase tracking-wider text-[#5F5E5A]">Open PRs</p>
          <p class="m-0 text-[17px] font-medium -tracking-[0.3px]">{repo.openPRs}</p>
        </div>
        <div class="rounded-[10px] bg-[#F6F5F1] p-3">
          <p class="m-0 mb-1 text-[10px] uppercase tracking-wider text-[#5F5E5A]">Last deploy</p>
          <p class="m-0 text-[17px] font-medium -tracking-[0.3px]">{repo.lastCommitAt}</p>
        </div>
      </div>

      <!-- Segmented control -->
      <div class="mx-4 mb-3 flex gap-0 rounded-[10px] bg-[#F6F5F1] p-[3px]">
        {#each ['commits', 'ci', 'issues'] as tab}
          <button
            onclick={() => activeTab = tab}
            class="min-h-[36px] flex-1 rounded-lg px-1 py-2 text-xs font-medium
              {activeTab === tab
                ? 'bg-white text-neutral-900 shadow-[0_0_0_0.5px_rgba(0,0,0,0.08)]'
                : 'bg-transparent text-[#5F5E5A]'}"
          >
            {tab === 'commits' ? 'Commits' : tab === 'ci' ? 'CI log' : 'Issues'}
          </button>
        {/each}
      </div>

      <!-- Commits tab -->
      {#if activeTab === 'commits'}
        <div class="flex items-baseline justify-between px-4 pb-2">
          <p class="m-0 text-[11px] font-medium uppercase tracking-wider text-[#5F5E5A]">Recent commits</p>
          <span class="font-mono text-xs text-[#5F5E5A]">{repo.branch}</span>
        </div>
        <div class="px-4 pb-4">
          {#each commits as commit}
            <a href="/repo/{repo.owner}/{repo.name}/commit/{commit.sha}" class="flex gap-2.5 border-b border-black/5 py-2.5 no-underline last:border-none">
              <span
                class="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full"
                style="background: {commit.ciStatus === 'ok' ? '#639922' : commit.ciStatus === 'fail' ? '#E24B4A' : '#378ADD'}"
              ></span>
              <div class="min-w-0 flex-1">
                <p class="m-0 mb-0.5 text-[13px] leading-snug text-neutral-900">{commit.message}</p>
                <p class="m-0 font-mono text-[11px] text-[#888780]">{commit.sha} · {commit.author} · {commit.time}</p>
              </div>
            </a>
          {/each}
        </div>
      {:else if activeTab === 'ci'}
        <div class="mx-4 mb-4 rounded-[10px] bg-[#2C2C2A] p-3.5 font-mono text-[11px] leading-relaxed text-[#D3D1C7]">
          <div>[09:32:01] › php lint src/</div>
          <div><span class="text-[#97C459]">✓</span> no syntax errors</div>
          <div>[09:32:09] › phpunit --testsuite unit</div>
          <div><span class="text-[#F09595]">✗</span> Tests\Donate\FormTest</div>
          <div class="text-[#F09595]">&nbsp;&nbsp;failed: nonce missing</div>
          <div><span class="text-[#F09595]">✗</span> exit code 1</div>
        </div>
      {:else}
        <div class="mx-4 mb-4 rounded-xl border border-black/5 bg-[#F6F5F1] p-6 text-center">
          <p class="m-0 text-sm text-[#5F5E5A]">Issues view — coming soon</p>
        </div>
      {/if}

      <!-- Actions -->
      <div class="flex gap-2 px-4 pb-4">
        <button class="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-black/5 bg-white px-2.5 text-xs font-medium">
          Rerun CI
        </button>
        <a href="https://github.com/{repo.owner}/{repo.name}" target="_blank" rel="noopener" class="flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-black/5 bg-white px-2.5 text-xs font-medium no-underline text-neutral-900">
          Open on GitHub
        </a>
      </div>
    </div>
  </div>
{/if}
