import { GitHubMilestone, GitHubRepository } from './github.js'

export interface DeliveryItem {
  id: string
  labels: string[]
  mergedAt: string | null
  closedAt: string | null
  milestone: GitHubMilestone | null
  number: number
  points: number
  project: {
    [key: string]: string
  }
  projectsV2: string[]
  repository: GitHubRepository
  title: string
  type: string
  url: string
}
