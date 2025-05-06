import type { AnyObject } from 'mingo/types'

import { DeliveryItem } from './delivery.js'

export interface MetricGroup {
  id: string
  name: string
  description: string
  query?: AnyObject
  nodes: DeliveryItem[]
  streams: MetricStream[]
  updatedAt: string
  weeks: MetricWeek[]
}

export interface MetricStream {
  name: string
  description: string
  nodes: DeliveryItem[]
  query: AnyObject
  weeks: MetricWeek[]
}

export interface MetricWeek {
  firstDay: Date
  nodes: DeliveryItem[]
  metrics: {
    nodes: {
      count: number
      velocity: number
      distribution: number
    }
    points: {
      count: number
      velocity: number
      distribution: number
    }
  }
}
