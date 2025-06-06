import { GitHubMilestone, GitHubRepository } from './github.js'

// The timeline object collected by GitHub
interface DeliveryTimelineEvent {
  id: string
  action: string
  date: string
  change?: {
    field_value?: {
      field_name: string
      from?: {
        name: string
      }
      to?: {
        name: string
      }
    }
  }
}

export interface DeliveryTimeline {
  id: string
  events: DeliveryTimelineEvent[]
}

interface DeliveryTimelineMetrics {
  duration: number
  endDate: string
  valueTo: string
  startDate: string
  valueFrom: string
}

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
  timeline?: DeliveryTimeline
  timelineMetrics?: DeliveryTimelineMetrics
}
