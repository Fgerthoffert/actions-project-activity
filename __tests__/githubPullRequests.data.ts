import { GitHubPullRequest } from '../src/types/index.js'

export const gitHubTestPullRequests: GitHubPullRequest[] = [
  {
    __typename: 'PullRequest',
    id: 'PR_1',
    title: 'chore: avoid building unnecessary artifacts',
    number: 1,
    closedAt: '2025-04-18T14:57:10Z',
    updatedAt: '2025-04-18T14:57:10Z',
    mergedAt: '2025-04-18T14:57:10Z',
    url: 'https://github.com/Org/repo-1/pull/1',
    repository: {
      name: 'repo-1',
      url: 'https://github.com/Org/repo-1',
      owner: { login: 'Org' }
    },
    milestone: null,
    labels: { nodes: [{ name: 'Area:Tech' }] },
    projectsV2: { nodes: [{ title: 'Team A' }] }
  },
  {
    __typename: 'PullRequest',
    id: 'PR_2',
    title: 'chore(deps): upgrade module engine',
    number: 2,
    closedAt: '2025-04-04T08:43:22Z',
    updatedAt: '2025-04-04T08:43:22Z',
    mergedAt: '2025-04-04T08:43:21Z',
    url: 'https://github.com/Org/repo-2/pull/2',
    repository: {
      name: 'repo-2',
      url: 'https://github.com/Org/repo-2',
      owner: { login: 'Org' }
    },
    milestone: { state: 'OPEN', title: 'Milestone 1' },
    labels: { nodes: [] },
    projectsV2: { nodes: [{ title: 'Team A' }] }
  },
  {
    __typename: 'PullRequest',
    id: 'PR_3',
    title: 'fix: backport missing fixes',
    number: 3,
    closedAt: '2025-03-27T14:52:01Z',
    updatedAt: '2025-03-27T14:52:01Z',
    mergedAt: '2025-03-27T14:52:01Z',
    url: 'https://github.com/Org/repo-3/pull/3',
    repository: {
      name: 'repo-3',
      url: 'https://github.com/Org/repo-3',
      owner: { login: 'Org' }
    },
    milestone: { state: 'CLOSED', title: 'Milestone 2' },
    labels: { nodes: [{ name: 'backport' }] },
    projectsV2: { nodes: [{ title: 'Team A' }] }
  },
  {
    __typename: 'PullRequest',
    id: 'PR_4',
    title: 'fix: check for version compatibility',
    number: 4,
    closedAt: '2025-03-05T09:27:20Z',
    updatedAt: '2025-03-05T09:27:20Z',
    mergedAt: '2025-03-05T09:27:20Z',
    url: 'https://github.com/Org/repo-1/pull/4',
    repository: {
      name: 'repo-1',
      url: 'https://github.com/Org/repo-1',
      owner: { login: 'Org' }
    },
    milestone: { state: 'OPEN', title: 'Milestone 1' },
    labels: { nodes: [{ name: 'Area:Product' }] },
    projectsV2: { nodes: [{ title: 'Team A' }, { title: 'Team B' }] }
  },
  {
    __typename: 'PullRequest',
    id: 'PR_5',
    title: 'ci: updated actions to v4',
    number: 5,
    closedAt: '2025-03-06T12:34:51Z',
    updatedAt: '2025-03-06T12:34:51Z',
    mergedAt: '2025-03-06T12:34:51Z',
    url: 'https://github.com/Org/repo-4/pull/5',
    repository: {
      name: 'repo-4',
      url: 'https://github.com/Org/repo-4',
      owner: { login: 'Org' }
    },
    milestone: null,
    labels: { nodes: [] },
    projectsV2: { nodes: [{ title: 'Team A' }, { title: 'Team C' }] }
  },
  {
    __typename: 'PullRequest',
    id: 'PR_6',
    title: 'chore: fix signature',
    number: 6,
    closedAt: '2025-03-14T09:22:15Z',
    updatedAt: '2025-03-14T09:22:15Z',
    mergedAt: '2025-03-14T09:22:15Z',
    url: 'https://github.com/Org/repo-5/pull/6',
    repository: {
      name: 'repo-5',
      url: 'https://github.com/Org/repo-5',
      owner: { login: 'Org' }
    },
    milestone: null,
    labels: { nodes: [] },
    projectsV2: { nodes: [{ title: 'Team A' }] }
  },
  {
    __typename: 'PullRequest',
    id: 'PR_7',
    title: 'test: add session invalidation test',
    number: 7,
    closedAt: '2025-03-13T20:28:01Z',
    updatedAt: '2025-03-13T20:28:01Z',
    mergedAt: '2025-03-13T20:28:01Z',
    url: 'https://github.com/Org/repo-6/pull/7',
    repository: {
      name: 'repo-6',
      url: 'https://github.com/Org/repo-6',
      owner: { login: 'Org' }
    },
    milestone: null,
    labels: { nodes: [] },
    projectsV2: { nodes: [{ title: 'Team A' }, { title: 'Team B' }] }
  },
  {
    __typename: 'PullRequest',
    id: 'PR_8',
    title: 'chore: update documentation',
    number: 8,
    closedAt: '2025-03-11T12:58:46Z',
    updatedAt: '2025-03-11T12:58:46Z',
    mergedAt: '2025-03-11T12:58:46Z',
    url: 'https://github.com/Org/repo-7/pull/8',
    repository: {
      name: 'repo-7',
      url: 'https://github.com/Org/repo-7',
      owner: { login: 'Org' }
    },
    milestone: { state: 'CLOSED', title: 'Milestone 3' },
    labels: { nodes: [] },
    projectsV2: { nodes: [{ title: 'Team A' }, { title: 'Team D' }] }
  },
  {
    __typename: 'PullRequest',
    id: 'PR_9',
    title: 'chore: rename module',
    number: 9,
    closedAt: '2025-03-14T13:01:42Z',
    updatedAt: '2025-03-14T13:01:42Z',
    mergedAt: '2025-03-14T13:01:42Z',
    url: 'https://github.com/Org/repo-8/pull/9',
    repository: {
      name: 'repo-8',
      url: 'https://github.com/Org/repo-8',
      owner: { login: 'Org' }
    },
    milestone: null,
    labels: { nodes: [] },
    projectsV2: { nodes: [{ title: 'Team A' }] }
  }
]
