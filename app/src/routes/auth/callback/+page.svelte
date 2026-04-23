<script>
  import { supabase } from '$lib/supabase.js';
  import { onMount } from 'svelte';

  onMount(async () => {
    // Supabase picks up the token from the URL fragment automatically.
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.provider_token) {
      // Store the GitHub token in an httpOnly cookie for server-side API calls.
      await fetch('/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: session.provider_token })
      });
    }

    window.location.href = '/';
  });
</script>

<div class="flex min-h-dvh items-center justify-center bg-white">
  <p class="text-sm text-[#5F5E5A]">Signing in…</p>
</div>
