// Mock data that mirrors the shape of what we'll get from GitHub + Supabase.
// Replace this module with real server calls in src/routes/+page.server.js
// once auth and sync are wired up.

/**
 * @typedef {'deployed' | 'failing' | 'building' | 'issues'} RepoStatus
 */

/**
 * @typedef {Object} Repo
 * @property {string} id
 * @property {string} name
 * @property {string} owner
 * @property {string} description
 * @property {RepoStatus} status
 * @property {number} openIssues
 * @property {number} openPRs
 * @property {string} language
 * @property {string} languageColor
 * @property {string} branch
 * @property {string} lastCommitSha
 * @property {string} lastCommitMessage
 * @property {string} lastCommitAuthor
 * @property {string} lastCommitAt
 * @property {number} stars
 */

/** @type {Repo[]} */
export const mockRepos = [
  {
    id: '1',
    name: 'davemelk.com',
    owner: 'davemelk',
    description: 'Personal portfolio site.',
    status: 'deployed',
    openIssues: 0,
    openPRs: 0,
    language: 'JavaScript',
    languageColor: '#f1e05a',
    branch: 'main',
    lastCommitSha: 'a7f3c21',
    lastCommitMessage: 'Tune type scale on mobile nav',
    lastCommitAuthor: 'dave',
    lastCommitAt: '2h',
    stars: 2
  },
  {
    id: '2',
    name: 'cygnetinstitute.org',
    owner: 'cygnet-institute',
    description: 'WordPress site for Cygnet Institute of Personal Financial Literacy.',
    status: 'failing',
    openIssues: 3,
    openPRs: 1,
    language: 'PHP',
    languageColor: '#4F5D95',
    branch: 'develop',
    lastCommitSha: 'e19d84b',
    lastCommitMessage: 'Add donation form to /support',
    lastCommitAuthor: 'dave',
    lastCommitAt: '6h',
    stars: 4
  },
  {
    id: '3',
    name: 'words-not-code',
    owner: 'davemelk',
    description: 'AI coding prompt generator for non-technical users.',
    status: 'building',
    openIssues: 1,
    openPRs: 0,
    language: 'HTML',
    languageColor: '#e34c26',
    branch: 'main',
    lastCommitSha: '4c2b890',
    lastCommitMessage: 'Add mobile-first blueprint module',
    lastCommitAuthor: 'dave',
    lastCommitAt: 'just now',
    stars: 0
  },
  {
    id: '4',
    name: 'calc-learning-center',
    owner: 'davemelk',
    description: 'Tutoring business WordPress site.',
    status: 'issues',
    openIssues: 3,
    openPRs: 0,
    language: 'PHP',
    languageColor: '#4F5D95',
    branch: 'main',
    lastCommitSha: 'bd7e045',
    lastCommitMessage: 'Stub contact form routes',
    lastCommitAuthor: 'dave',
    lastCommitAt: '1d',
    stars: 0
  },
  {
    id: '5',
    name: 'dx21-service-manual',
    owner: 'davemelk',
    description: 'Yamaha DX21 repair notes and schematics.',
    status: 'deployed',
    openIssues: 0,
    openPRs: 0,
    language: 'Markdown',
    languageColor: '#083fa1',
    branch: 'main',
    lastCommitSha: '2f81a0c',
    lastCommitMessage: 'CR2032 holder sourcing notes',
    lastCommitAuthor: 'dave',
    lastCommitAt: '3d',
    stars: 1
  }
];

/**
 * @typedef {Object} Commit
 * @property {string} sha
 * @property {string} message
 * @property {string} author
 * @property {string} time
 * @property {'ok' | 'fail' | 'pending'} ciStatus
 */

/** @type {Record<string, Commit[]>} */
export const mockCommits = {
  '2': [
    { sha: 'e19d84b', message: 'Add donation form to /support page', author: 'dave', time: '6h ago', ciStatus: 'fail' },
    { sha: '91ac3d0', message: 'Update GA4 event names for giving pages', author: 'dave', time: 'yesterday', ciStatus: 'ok' },
    { sha: '2b6f118', message: 'Swap GivingPress Lite footer widgets', author: 'dave', time: '2d ago', ciStatus: 'ok' },
    { sha: '58aa4e2', message: 'Move UTM params into plugin config', author: 'dave', time: '3d ago', ciStatus: 'ok' }
  ]
};

export const statusMeta = {
  deployed: { label: 'Deployed', bg: 'var(--color-status-ok-bg)', fg: 'var(--color-status-ok-fg)', dot: 'var(--color-status-ok-dot)' },
  failing:  { label: 'CI fail',  bg: 'var(--color-status-fail-bg)', fg: 'var(--color-status-fail-fg)', dot: 'var(--color-status-fail-dot)' },
  building: { label: 'Building', bg: 'var(--color-status-run-bg)', fg: 'var(--color-status-run-fg)', dot: 'var(--color-status-run-dot)' },
  issues:   { label: 'Issues',   bg: 'var(--color-status-warn-bg)', fg: 'var(--color-status-warn-fg)', dot: 'var(--color-status-warn-dot)' }
};
