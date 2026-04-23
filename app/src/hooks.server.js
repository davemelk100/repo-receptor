import { createSupabaseServerClient } from '$lib/server/supabase.js';

export async function handle({ event, resolve }) {
  event.locals.supabase = createSupabaseServerClient({ cookies: event.cookies });

  // Convenience helper — returns null when not signed in.
  event.locals.getSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession();
    return session;
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range' || name === 'x-supabase-api-version';
    }
  });
}
