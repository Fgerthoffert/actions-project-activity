import { GitHubIssue } from '../src/types/index.js'

export const gitHubTestIssues: GitHubIssue[] = [
  {
    __typename: 'Issue',
    id: 'I_1',
    title: 'Issue title 1',
    number: 1,
    closedAt: '2025-04-30T09:36:18Z',
    updatedAt: '2025-04-30T09:36:18Z',
    mergedAt: '2025-04-30T09:36:18Z',
    url: 'https://github.com/owner/repo/issues/1',
    repository: {
      name: 'repo1',
      url: 'https://github.com/owner/repo1',
      owner: { login: 'owner' }
    },
    milestone: { state: 'OPEN', title: 'Milestone 1' },
    labels: { nodes: [] },
    projectsV2: { nodes: [{ title: 'Project 1' }] }
  },
  {
    __typename: 'Issue',
    id: 'I_2',
    title: 'Issue title 2',
    number: 2,
    closedAt: '2025-04-30T12:06:42Z',
    updatedAt: '2025-04-30T12:06:42Z',
    mergedAt: '2025-04-30T12:06:42Z',
    url: 'https://github.com/owner/repo/issues/2',
    repository: {
      name: 'repo2',
      url: 'https://github.com/owner/repo2',
      owner: { login: 'owner' }
    },
    milestone: { state: 'OPEN', title: 'Milestone 2' },
    labels: { nodes: [] },
    projectsV2: { nodes: [{ title: 'Project 1' }] }
  },
  {
    __typename: 'Issue',
    id: 'I_3',
    title: 'Issue title 3',
    number: 3,
    closedAt: '2025-04-30T14:00:41Z',
    updatedAt: '2025-04-30T14:00:41Z',
    mergedAt: '2025-04-30T14:00:41Z',
    url: 'https://github.com/owner/repo/issues/3',
    repository: {
      name: 'repo3',
      url: 'https://github.com/owner/repo3',
      owner: { login: 'owner' }
    },
    milestone: { state: 'OPEN', title: 'Milestone 3' },
    labels: { nodes: [] },
    projectsV2: { nodes: [{ title: 'Project 1' }] }
  },
  {
    __typename: 'Issue',
    id: 'I_4',
    title: 'Issue title 4',
    number: 4,
    closedAt: '2025-04-30T15:28:37Z',
    updatedAt: '2025-04-30T15:28:37Z',
    mergedAt: '2025-04-30T15:28:37Z',
    url: 'https://github.com/owner/repo/issues/4',
    repository: {
      name: 'repo4',
      url: 'https://github.com/owner/repo4',
      owner: { login: 'owner' }
    },
    milestone: { state: 'OPEN', title: 'Milestone 4' },
    labels: { nodes: [] },
    projectsV2: { nodes: [{ title: 'Project 1' }] }
  },
  {
    __typename: 'Issue',
    id: 'I_5',
    title: 'Issue title 5',
    number: 5,
    closedAt: '2025-04-29T13:07:31Z',
    updatedAt: '2025-04-29T13:07:31Z',
    mergedAt: '2025-04-29T13:07:31Z',
    url: 'https://github.com/owner/repo/issues/5',
    repository: {
      name: 'repo5',
      url: 'https://github.com/owner/repo5',
      owner: { login: 'owner' }
    },
    milestone: { state: 'OPEN', title: 'Milestone 5' },
    labels: { nodes: [] },
    projectsV2: { nodes: [{ title: 'Project 1' }] }
  },
  {
    __typename: 'Issue',
    id: 'I_6',
    title: 'Issue title 6',
    number: 6,
    closedAt: '2025-04-28T06:30:55Z',
    updatedAt: '2025-04-28T06:30:55Z',
    mergedAt: '2025-04-28T06:30:55Z',
    url: 'https://github.com/owner/repo/issues/6',
    repository: {
      name: 'repo6',
      url: 'https://github.com/owner/repo6',
      owner: { login: 'owner' }
    },
    milestone: { state: 'OPEN', title: 'Milestone 6' },
    labels: { nodes: [{ name: 'label1' }] },
    projectsV2: { nodes: [{ title: 'Project 1' }] }
  },
  {
    __typename: 'Issue',
    id: 'I_7',
    title: 'Issue title 7',
    number: 7,
    closedAt: '2025-04-28T14:48:30Z',
    updatedAt: '2025-04-28T14:48:30Z',
    mergedAt: '2025-04-28T14:48:30Z',
    url: 'https://github.com/owner/repo/issues/7',
    repository: {
      name: 'repo7',
      url: 'https://github.com/owner/repo7',
      owner: { login: 'owner' }
    },
    milestone: { state: 'OPEN', title: 'Milestone 7' },
    labels: { nodes: [] },
    projectsV2: { nodes: [{ title: 'Project 1' }, { title: 'Project 2' }] }
  },
  {
    __typename: 'Issue',
    id: 'I_8',
    title: 'Issue title 8',
    number: 8,
    closedAt: '2025-04-28T14:47:55Z',
    updatedAt: '2025-04-28T14:47:55Z',
    mergedAt: '2025-04-28T14:47:55Z',
    url: 'https://github.com/owner/repo/issues/8',
    repository: {
      name: 'repo8',
      url: 'https://github.com/owner/repo8',
      owner: { login: 'owner' }
    },
    milestone: { state: 'OPEN', title: 'Milestone 8' },
    labels: { nodes: [{ name: 'label2' }] },
    projectsV2: { nodes: [{ title: 'Project 1' }] }
  }
]
