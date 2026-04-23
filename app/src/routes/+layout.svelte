<script>
  import '../app.css';
  import { supabase } from '$lib/supabase.js';
  import { invalidateAll } from '$app/navigation';
  import { navigating } from '$app/state';
  import { onMount } from 'svelte';

  let { children, data } = $props();

  onMount(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      invalidateAll();
    });
    return () => subscription.unsubscribe();
  });
</script>

{#if navigating.to}
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
    <div class="loading-spinner h-6 w-6 rounded-full border-2 border-black/10 border-t-neutral-900"></div>
  </div>
{/if}

{@render children()}

<style>
  .loading-spinner {
    animation: spin 0.6s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
</style>
