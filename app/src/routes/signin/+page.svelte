<script>
  import { supabase } from '$lib/supabase.js';
  let { data } = $props();

  // Redirect if already signed in.
  $effect(() => {
    if (data.session) window.location.href = '/';
  });

  async function signInWithGitHub() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        scopes: 'repo read:user'
      }
    });
    if (error) console.error('OAuth error', error);
  }
</script>

<svelte:head>
  <title>Sign in · repo-receptor</title>
</svelte:head>

<div class="flex min-h-dvh flex-col bg-white px-6 pb-6 pt-8">
  <div class="my-8 flex justify-center">
    <svg width="140" height="110" viewBox="0 0 140 110" fill="none" aria-hidden="true">
      <rect x="20" y="24" width="100" height="64" rx="10" fill="#F1EFE8" stroke="#D3D1C7" stroke-width="1"/>
      <circle cx="45" cy="48" r="4" fill="#D3D1C7"/>
      <rect x="56" y="44" width="48" height="3" rx="1.5" fill="#D3D1C7"/>
      <rect x="56" y="52" width="32" height="3" rx="1.5" fill="#D3D1C7"/>
      <circle cx="45" cy="72" r="4" fill="#D3D1C7"/>
      <rect x="56" y="68" width="40" height="3" rx="1.5" fill="#D3D1C7"/>
      <rect x="56" y="76" width="24" height="3" rx="1.5" fill="#D3D1C7"/>
      <g transform="translate(92, 58)">
        <circle r="20" fill="#EEEDFE" stroke="#AFA9EC" stroke-width="1"/>
        <path d="M0 -8a3.5 3.5 0 0 0-1.1 6.83c.17.03.23-.07.23-.16v-.58c-.97.21-1.18-.47-1.18-.47-.16-.4-.39-.5-.39-.5-.31-.22.02-.21.02-.21.35.02.54.36.54.36.31.53.82.38 1.02.29.03-.22.12-.38.22-.47-.77-.09-1.6-.39-1.6-1.72 0-.38.14-.7.36-.94-.04-.09-.16-.45.03-.93 0 0 .3-.09.96.36.28-.08.58-.12.87-.12.3 0 .6.04.87.12.67-.45.96-.36.96-.36.19.48.07.84.03.93.23.24.36.56.36.94 0 1.34-.82 1.63-1.6 1.72.13.11.24.32.24.66v.97c0 .1.06.2.24.16A3.5 3.5 0 0 0 0 -8z" fill="#3C3489"/>
      </g>
    </svg>
  </div>

  <h1 class="m-0 mb-2.5 text-center text-[22px] font-medium leading-tight -tracking-[0.5px]">
    Connect GitHub to see your repos
  </h1>
  <p class="m-0 mb-7 text-center text-sm leading-relaxed text-[#5F5E5A]">
    repo-receptor pulls deploy status, CI runs and open issues from every repo you own or collaborate on.
  </p>

  <ul class="m-0 mb-6 list-none rounded-xl bg-[#F6F5F1] p-4">
    {#each ['Read repos, commits and CI status', 'Sync in the background every 15 min', 'Never writes or pushes anything'] as item, i}
      <li class="flex items-start gap-3 py-1.5 {i < 2 ? 'mb-1 border-b border-black/5 pb-2.5' : ''}">
        <div class="mt-0.5 flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full bg-[#EAF3DE] text-[#27500A]">
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 5.5l2 2 4-4.5"/></svg>
        </div>
        <span class="text-[13px] leading-snug">{item}</span>
      </li>
    {/each}
  </ul>

  <div class="mt-auto flex flex-col gap-2.5">
    <button
      onclick={signInWithGitHub}
      class="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 text-[15px] font-medium text-white"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1.5a6.5 6.5 0 0 0-2.05 12.66c.32.06.44-.14.44-.31v-1.1c-1.8.39-2.18-.87-2.18-.87-.3-.74-.72-.94-.72-.94-.58-.4.04-.39.04-.39.65.04 1 .67 1 .67.58.99 1.52.7 1.89.54.06-.42.23-.71.41-.87-1.44-.16-2.96-.72-2.96-3.2 0-.71.25-1.29.67-1.74-.07-.17-.29-.83.06-1.73 0 0 .54-.17 1.78.67.52-.14 1.07-.22 1.62-.22.55 0 1.1.08 1.62.22 1.23-.84 1.78-.67 1.78-.67.35.9.13 1.56.06 1.73.42.45.67 1.03.67 1.74 0 2.49-1.52 3.03-2.97 3.2.23.2.44.6.44 1.22v1.81c0 .18.12.38.44.31A6.5 6.5 0 0 0 8 1.5z"/>
      </svg>
      Sign in with GitHub
    </button>
    <a href="/" class="block w-full min-h-[44px] py-2.5 text-center text-[13px] text-[#5F5E5A] no-underline">See a demo first</a>
    <div class="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-[#888780]">
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2"><rect x="2.5" y="5" width="7" height="5" rx="1"/><path d="M4 5V3.5a2 2 0 0 1 4 0V5"/></svg>
      Read-only scope. Revoke anytime.
    </div>
  </div>
</div>
