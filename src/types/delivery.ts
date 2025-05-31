import { GitHubMilestone, GitHubRepository } from './github.js'

interface DeliveryInitiative {
  id: string
  name: string
  title: string
  url: string
}

export interface DeliveryItemWithInitiative {
  id: string
  initiative: DeliveryInitiative
}

export interface DeliveryItem {
  id: string
  labels: string[]
  mergedAt: string | null
  closedAt: string | null
  milestone: GitHubMilestone | null
  initiative: DeliveryInitiative | null
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
