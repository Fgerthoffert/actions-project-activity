import type { AnyObject } from 'mingo/types'

export interface ConfigGroupStream {
  name: string
  description: string
  query: AnyObject
}

export interface ConfigInitiative {
  name: string
  description: string
  repository: string
  issueNumber: number
}

export interface ConfigTimelineGroup {
  name: string
  description: string
  fields: string[]
  valueFrom: string
  valueTo?: string
  query: AnyObject
  groupByField?: string
}

export interface ConfigTimeline {
  remote: {
    baseUrl: string
    username: string
    password: string
  }
  enabled: boolean
  groups: ConfigTimelineGroup[]
}

export interface ConfigGroup {
  name: string
  description: string
  defaultMetrics: 'points' | 'nodes'
  query?: AnyObject
  groupByField?: string
  streamsTemplate?: string
  streams: ConfigGroupStream[]
}

export interface ConfigTemplate {
  name: string
  description: string
  streams: ConfigGroupStream[]
}

export interface Config {
  fields: {
    [key: string]: string
  }
  movingWindow: number
  initiatives: ConfigInitiative[]
  timeline?: ConfigTimeline
  groups: ConfigGroup[]
  templates: ConfigTemplate[]
}
