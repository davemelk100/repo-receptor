import { fetchUserRepos } from '$lib/server/github.js';

export async function load({ cookies }) {
  const token = cookies.get('gh_token');
  if (!token) return { repos: null };

  try {
    const repos = await fetchUserRepos(token);
    return { repos };
  } catch {
    return { repos: null };
  }
}
