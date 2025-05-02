import type { AnyObject } from 'mingo/types'

interface ConfigGroupStream {
  name: string
  description: string
  query: AnyObject
}

interface ConfigGroup {
  name: string
  description: string
  streams: ConfigGroupStream[]
}

export interface Config {
  fields: {
    [key: string]: string
  }
  movingWindow: number
  groups: ConfigGroup[]
}
