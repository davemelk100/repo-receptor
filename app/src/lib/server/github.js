const GITHUB_API = 'https://api.github.com';

/**
 * Fetch all repos the authenticated user has access to.
 * @param {string} token - GitHub OAuth access token
 * @returns {Promise<import('$lib/data/mock.js').Repo[]>}
 */
export async function fetchUserRepos(token) {
  const repos = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `${GITHUB_API}/user/repos?per_page=100&sort=pushed&page=${page}`,
      { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } }
    );

    if (!res.ok) break;

    const batch = await res.json();
    if (batch.length === 0) break;

    repos.push(...batch);
    if (batch.length < 100) break;
    page++;
  }

  return repos.map(toRepoShape);
}

const langColors = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  PHP: '#4F5D95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Svelte: '#ff3e00',
  Java: '#b07219',
  Ruby: '#701516',
  Markdown: '#083fa1',
  'C++': '#f34b7d',
  C: '#555555',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB'
};

function toRepoShape(r) {
  const pushedAt = r.pushed_at ? new Date(r.pushed_at) : null;
  return {
    id: String(r.id),
    name: r.name,
    owner: r.owner?.login ?? '',
    description: r.description ?? '',
    status: r.archived ? 'archived' : r.open_issues_count > 0 ? 'issues' : 'deployed',
    openIssues: r.open_issues_count ?? 0,
    openPRs: 0,
    language: r.language ?? 'Unknown',
    languageColor: langColors[r.language] ?? '#888888',
    branch: r.default_branch ?? 'main',
    lastCommitSha: '',
    lastCommitMessage: r.description ?? '',
    lastCommitAuthor: r.owner?.login ?? '',
    lastCommitAt: pushedAt ? timeAgo(pushedAt) : '',
    stars: r.stargazers_count ?? 0
  };
}

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.floor(days / 30);
  return `${months}mo`;
}

const headers = (token) => ({
  Authorization: `Bearer ${token}`,
  Accept: 'application/vnd.github+json'
});

/**
 * Fetch the authenticated user's GitHub profile.
 */
export async function fetchUserProfile(token) {
  const res = await fetch(`${GITHUB_API}/user`, { headers: headers(token) });
  if (!res.ok) return null;
  const u = await res.json();
  return {
    login: u.login,
    name: u.name,
    avatarUrl: u.avatar_url,
    bio: u.bio,
    location: u.location,
    company: u.company,
    blog: u.blog,
    email: u.email,
    publicRepos: u.public_repos,
    totalPrivateRepos: u.total_private_repos ?? 0,
    followers: u.followers,
    following: u.following,
    createdAt: u.created_at
  };
}

/**
 * Fetch recent events for the authenticated user (last 90 days max from API).
 * Returns up to 300 events (3 pages).
 */
export async function fetchUserEvents(token, username) {
  const events = [];
  for (let page = 1; page <= 3; page++) {
    const res = await fetch(
      `${GITHUB_API}/users/${username}/events?per_page=100&page=${page}`,
      { headers: headers(token) }
    );
    if (!res.ok) break;
    const batch = await res.json();
    if (batch.length === 0) break;
    events.push(...batch);
    if (batch.length < 100) break;
  }
  return events;
}

/**
 * Build stats from raw repo data (GitHub API shape, not our mapped shape).
 */
export function buildRepoStats(repos) {
  const languages = {};
  let totalStars = 0;
  let totalIssues = 0;
  let totalForks = 0;

  for (const r of repos) {
    totalStars += r.stargazers_count ?? 0;
    totalIssues += r.open_issues_count ?? 0;
    totalForks += r.forks_count ?? 0;

    const lang = r.language ?? 'Unknown';
    languages[lang] = (languages[lang] ?? 0) + 1;
  }

  const languageBreakdown = Object.entries(languages)
    .map(([name, count]) => ({ name, count, color: langColors[name] ?? '#888888' }))
    .sort((a, b) => b.count - a.count);

  const mostActive = repos
    .filter(r => r.pushed_at)
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 5)
    .map(r => ({
      name: r.name,
      owner: r.owner?.login ?? '',
      pushedAt: timeAgo(new Date(r.pushed_at)),
      language: r.language ?? 'Unknown',
      languageColor: langColors[r.language] ?? '#888888',
      stars: r.stargazers_count ?? 0,
      issues: r.open_issues_count ?? 0
    }));

  return {
    totalRepos: repos.length,
    totalStars,
    totalIssues,
    totalForks,
    languageBreakdown,
    mostActive
  };
}

/**
 * Build a daily activity heatmap from events.
 * Returns an array of { date, count } for the last 30 days.
 */
export function buildActivityTimeline(events) {
  const now = new Date();
  const days = 30;
  const counts = {};

  // Init last 30 days
  for (let i = 0; i < days; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    counts[d.toISOString().slice(0, 10)] = 0;
  }

  for (const e of events) {
    const day = e.created_at?.slice(0, 10);
    if (day && day in counts) {
      counts[day]++;
    }
  }

  return Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Fetch raw repos (unmapped) for stats computation.
 */
export async function fetchRawRepos(token) {
  const repos = [];
  let page = 1;

  while (true) {
    const res = await fetch(
      `${GITHUB_API}/user/repos?per_page=100&sort=pushed&page=${page}`,
      { headers: headers(token) }
    );
    if (!res.ok) break;
    const batch = await res.json();
    if (batch.length === 0) break;
    repos.push(...batch);
    if (batch.length < 100) break;
    page++;
  }

  return repos;
}
