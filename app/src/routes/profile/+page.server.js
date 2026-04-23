import { fetchUserProfile } from '$lib/server/github.js';

export async function load({ cookies }) {
  const token = cookies.get('gh_token');
  if (!token) return { profile: null, hasToken: false };

  try {
    const profile = await fetchUserProfile(token);
    return { profile, hasToken: true };
  } catch {
    return { profile: null, hasToken: false };
  }
}
