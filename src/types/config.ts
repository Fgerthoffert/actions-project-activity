import type { AnyObject } from 'mingo/types'

interface ConfigGroupStream {
  name: string
  description: string
  query: AnyObject
}

interface ConfigInitiative {
  name: string
  description: string
  repository: string
  issueNumber: number
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
  groups: ConfigGroup[]
  templates: ConfigTemplate[]
}
