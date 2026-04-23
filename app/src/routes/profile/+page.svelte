<script>
  let { data } = $props();

  const profile = $derived(data.profile);
  const hasToken = $derived(data.hasToken);

  const memberSince = $derived(
    profile?.createdAt
      ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      : null
  );

  const initials = $derived(
    profile?.name
      ? profile.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
      : (profile?.login ?? '?').slice(0, 2).toUpperCase()
  );
</script>

<svelte:head>
  <title>Profile · repo-receptor</title>
</svelte:head>

<div class="flex h-dvh flex-col bg-white">
  <header class="border-b border-black/5 px-4 py-3">
    <h1 class="m-0 text-[17px] font-medium -tracking-[0.3px]">Profile</h1>
  </header>

  <div class="flex-1 overflow-y-auto">
    {#if profile}
      <!-- Avatar + name -->
      <div class="flex flex-col items-center px-4 pt-6 pb-4">
        {#if profile.avatarUrl}
          <img src={profile.avatarUrl} alt="Avatar" class="mb-3 h-20 w-20 rounded-full" />
        {:else}
          <div class="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-[#EEEDFE] text-2xl font-medium text-[#3C3489]">{initials}</div>
        {/if}
        <p class="m-0 text-lg font-medium -tracking-[0.3px]">{profile.name ?? profile.login}</p>
        <p class="m-0 mt-0.5 font-mono text-sm text-[#888780]">@{profile.login}</p>
        {#if profile.bio}
          <p class="m-0 mt-2 text-center text-xs leading-relaxed text-[#5F5E5A]">{profile.bio}</p>
        {/if}
      </div>

      <!-- Quick stats -->
      <div class="grid grid-cols-3 gap-2 px-4 pb-4">
        <div class="rounded-[10px] bg-[#F6F5F1] p-3 text-center">
          <p class="m-0 text-lg font-medium">{profile.publicRepos + profile.totalPrivateRepos}</p>
          <p class="m-0 text-[11px] text-[#5F5E5A]">Repos</p>
        </div>
        <div class="rounded-[10px] bg-[#F6F5F1] p-3 text-center">
          <p class="m-0 text-lg font-medium">{profile.followers}</p>
          <p class="m-0 text-[11px] text-[#5F5E5A]">Followers</p>
        </div>
        <div class="rounded-[10px] bg-[#F6F5F1] p-3 text-center">
          <p class="m-0 text-lg font-medium">{profile.following}</p>
          <p class="m-0 text-[11px] text-[#5F5E5A]">Following</p>
        </div>
      </div>

      <!-- Details -->
      <div class="px-4 pb-4">
        <div class="rounded-xl border border-black/5">
          {#if profile.location}
            <div class="flex items-center gap-3 border-b border-black/5 px-3 py-2.5">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#888780" stroke-width="1.3"><path d="M8 14s-5-4.6-5-7.5a5 5 0 0 1 10 0C13 9.4 8 14 8 14z"/><circle cx="8" cy="6.5" r="1.5"/></svg>
              <span class="text-xs">{profile.location}</span>
            </div>
          {/if}
          {#if profile.company}
            <div class="flex items-center gap-3 border-b border-black/5 px-3 py-2.5">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#888780" stroke-width="1.3"><rect x="2" y="4" width="12" height="10" rx="1"/><path d="M5 4V2.5A1.5 1.5 0 0 1 6.5 1h3A1.5 1.5 0 0 1 11 2.5V4"/></svg>
              <span class="text-xs">{profile.company}</span>
            </div>
          {/if}
          {#if profile.blog}
            <div class="flex items-center gap-3 border-b border-black/5 px-3 py-2.5">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#888780" stroke-width="1.3"><path d="M6.5 10.5l3-5"/><path d="M4.5 8.5l-2 2a1.4 1.4 0 0 0 2 2l2-2"/><path d="M11.5 7.5l2-2a1.4 1.4 0 0 0-2-2l-2 2"/></svg>
              <a href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`} target="_blank" rel="noopener" class="truncate text-xs text-[#3C3489] no-underline">{profile.blog}</a>
            </div>
          {/if}
          {#if profile.email}
            <div class="flex items-center gap-3 border-b border-black/5 px-3 py-2.5">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#888780" stroke-width="1.3"><rect x="1.5" y="3.5" width="13" height="9" rx="1.5"/><path d="M1.5 5l6.5 4 6.5-4"/></svg>
              <span class="text-xs text-[#5F5E5A]">{profile.email}</span>
            </div>
          {/if}
          {#if memberSince}
            <div class="flex items-center gap-3 px-3 py-2.5">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#888780" stroke-width="1.3"><rect x="2" y="3" width="12" height="11" rx="1.5"/><path d="M2 6.5h12"/><path d="M5.5 1.5v3"/><path d="M10.5 1.5v3"/></svg>
              <span class="text-xs text-[#5F5E5A]">Member since {memberSince}</span>
            </div>
          {/if}
        </div>
      </div>

      <!-- Connected account -->
      <div class="px-4 pb-4">
        <p class="m-0 mb-2 text-[11px] font-medium uppercase tracking-wider text-[#5F5E5A]">Connected account</p>
        <div class="flex items-center gap-3 rounded-xl border border-black/5 px-3 py-3">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="#F1EFE8">
              <path d="M8 1.5a6.5 6.5 0 0 0-2.05 12.66c.32.06.44-.14.44-.31v-1.1c-1.8.39-2.18-.87-2.18-.87-.3-.74-.72-.94-.72-.94-.58-.4.04-.39.04-.39.65.04 1 .67 1 .67.58.99 1.52.7 1.89.54.06-.42.23-.71.41-.87-1.44-.16-2.96-.72-2.96-3.2 0-.71.25-1.29.67-1.74-.07-.17-.29-.83.06-1.73 0 0 .54-.17 1.78.67.52-.14 1.07-.22 1.62-.22.55 0 1.1.08 1.62.22 1.23-.84 1.78-.67 1.78-.67.35.9.13 1.56.06 1.73.42.45.67 1.03.67 1.74 0 2.49-1.52 3.03-2.97 3.2.23.2.44.6.44 1.22v1.81c0 .18.12.38.44.31A6.5 6.5 0 0 0 8 1.5z"/>
            </svg>
          </div>
          <div class="flex-1">
            <p class="m-0 text-sm font-medium">GitHub</p>
            <p class="m-0 text-[11px] text-[#888780]">{hasToken ? 'Connected' : 'Token expired — sign in again'}</p>
          </div>
          <span class="inline-block h-2 w-2 rounded-full {hasToken ? 'bg-[#2DA44E]' : 'bg-[#D1242F]'}"></span>
        </div>
      </div>

      <!-- Sign out -->
      <div class="px-4 pb-6">
        <form method="POST" action="/auth/signout">
          <button type="submit" class="w-full rounded-xl border border-black/10 bg-white py-3 text-sm font-medium text-neutral-900">Sign out</button>
        </form>
      </div>

    {:else}
      <!-- Not signed in -->
      <div class="flex flex-1 items-center justify-center p-8">
        <div class="text-center">
          <div class="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#EEEDFE] text-lg font-medium text-[#3C3489]">?</div>
          <p class="m-0 mb-1 text-sm font-medium">Not signed in</p>
          <p class="m-0 text-xs text-[#5F5E5A]">Sign in to manage your account and preferences.</p>
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
    <a href="/stats" class="flex min-h-[44px] min-w-[60px] flex-col items-center gap-1 px-4 py-1.5 text-[#888780] no-underline">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 16l4-4 3 3 7-7"/><path d="M13 8h4v4"/></svg>
      <span class="text-[10px] font-medium">Stats</span>
    </a>
    <a href="/profile" class="flex min-h-[44px] min-w-[60px] flex-col items-center gap-1 px-4 py-1.5 text-neutral-900 no-underline">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="10" cy="7" r="3"/><path d="M3 17c0-3.5 3-6 7-6s7 2.5 7 6"/></svg>
      <span class="text-[10px] font-medium">Profile</span>
    </a>
  </nav>
</div>
