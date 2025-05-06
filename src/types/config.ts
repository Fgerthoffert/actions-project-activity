import type { AnyObject } from 'mingo/types'

interface ConfigGroupStream {
  name: string
  description: string
  query: AnyObject
}

export interface ConfigGroup {
  name: string
  description: string
  defaultMetrics: 'points' | 'nodes'
  query?: AnyObject
  groupByField?: string
  streams: ConfigGroupStream[]
}

export interface Config {
  fields: {
    [key: string]: string
  }
  movingWindow: number
  groups: ConfigGroup[]
}
