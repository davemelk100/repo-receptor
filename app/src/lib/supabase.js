import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Client-side Supabase instance. Server-side code should use the SSR helpers
// in src/lib/server/supabase.js so auth cookies flow correctly across requests.
export const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);
