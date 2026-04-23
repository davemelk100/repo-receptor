import { redirect } from '@sveltejs/kit';

export async function POST({ locals, cookies }) {
  await locals.supabase.auth.signOut();
  cookies.delete('gh_token', { path: '/' });
  redirect(303, '/signin');
}
