interface GitHubOrganization {
  login: string
}

export interface GitHubRateLimit {
  limit: number
  cost: number
  remaining: number
  resetAt: string | null
}

export interface GitHubRepository {
  name: string
  owner: GitHubOrganization
  url: string
}

export interface GitHubProject {
  id?: string
  title: string
  items?: {
    totalCount: number
  }
}

export interface GitHubMilestone {
  state: string
  title: string
}

export interface GitHubProjectV2Node {
  id: string
  title: string
  items: GitHubProjectCardConnection
}

interface GitHubProjectCardConnection {
  totalCount: number
  edges: GitHubProjectCardEdge[]
  pageInfo: GitHubPageInfo
}

interface GitHubPageInfo {
  hasNextPage: boolean
  endCursor: string | null
}

export interface GitHubProjectCardEdge {
  cursor: string
  node: GitHubProjectCard
}

export interface GitHubProjectCard {
  id: string
  updatedAt: string
  content: GitHubIssue | GitHubPullRequest | null
  fieldValues: {
    nodes: GitHubProjectV2ItemFieldValue[]
  }
}

export interface GitHubLabel {
  name: string
}

interface GitHubIssuesOrPullRequestsAugmented {
  points?: number
  project?: {
    [key: string]: string
  }
}

export interface GitHubIssue extends GitHubIssuesOrPullRequestsAugmented {
  __typename: 'Issue'
  id: string
  title: string
  number: number
  closedAt: string | null
  url: string
  repository: GitHubRepository
  milestone: GitHubMilestone | null
  labels: {
    nodes: GitHubLabel[]
  }
  projectsV2: {
    nodes: GitHubProject[]
  }
  updatedAt: string
  mergedAt: string | null
}

export interface GitHubPullRequest extends GitHubIssuesOrPullRequestsAugmented {
  __typename: 'PullRequest'
  id: string
  title: string
  number: number
  updatedAt: string
  mergedAt: string | null
  closedAt: string | null
  url: string
  repository: GitHubRepository
  milestone: GitHubMilestone | null
  labels: {
    nodes: GitHubLabel[]
  }
  projectsV2: {
    nodes: GitHubProject[]
  }
}

// Base interface for all field value types
interface GitHubBaseFieldValue {
  __typename: string
  field: {
    name: string
  }
}

interface GitHubProjectV2ItemFieldDateValue extends GitHubBaseFieldValue {
  __typename: 'ProjectV2ItemFieldDateValue'
  date: string | null
}

interface GitHubProjectV2ItemFieldIterationValue extends GitHubBaseFieldValue {
  __typename: 'ProjectV2ItemFieldIterationValue'
  title: string
}

interface GitHubProjectV2ItemFieldNumberValue extends GitHubBaseFieldValue {
  __typename: 'ProjectV2ItemFieldNumberValue'
  number: number
}

interface GitHubProjectV2ItemFieldSingleSelectValue
  extends GitHubBaseFieldValue {
  __typename: 'ProjectV2ItemFieldSingleSelectValue'
  name: string
}

interface GitHubProjectV2ItemFieldTextValue extends GitHubBaseFieldValue {
  __typename: 'ProjectV2ItemFieldTextValue'
  text: string
}

// Union type for all possible field values
export type GitHubProjectV2ItemFieldValue =
  | GitHubProjectV2ItemFieldDateValue
  | GitHubProjectV2ItemFieldIterationValue
  | GitHubProjectV2ItemFieldNumberValue
  | GitHubProjectV2ItemFieldSingleSelectValue
  | GitHubProjectV2ItemFieldTextValue
