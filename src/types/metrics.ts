import type { AnyObject } from 'mingo/types'

import { DeliveryItem } from './index.js'

export interface TimelineMetrics {
  datapoints: number[]
  min: number
  max: number
  median: number
  l90: {
    datapoints: number[]
    min: number
    max: number
    median: number
  }
}

export interface TimelineSubGroup {
  description: string
  metrics: TimelineMetrics
  name: string
  nodes: DeliveryItem[]
  query?: AnyObject
}

export interface TimelineGroup {
  id: string
  name: string
  description: string
  field: string
  updatedAt: string
  nodes: DeliveryItem[]
  groups: TimelineSubGroup[]
  metrics: TimelineMetrics
}

export interface MetricGroup {
  id: string
  name: string
  description: string
  category?: string
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
