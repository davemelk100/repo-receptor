import { fetchRawRepos, fetchUserProfile, fetchUserEvents, buildRepoStats, buildActivityTimeline } from '$lib/server/github.js';

export async function load({ cookies }) {
  const token = cookies.get('gh_token');
  if (!token) return { stats: null, activity: null };

  try {
    const [rawRepos, profile] = await Promise.all([
      fetchRawRepos(token),
      fetchUserProfile(token)
    ]);

    const stats = buildRepoStats(rawRepos);

    let activity = [];
    if (profile?.login) {
      const events = await fetchUserEvents(token, profile.login);
      activity = buildActivityTimeline(events);
    }

    return { stats, activity };
  } catch {
    return { stats: null, activity: null };
  }
}
