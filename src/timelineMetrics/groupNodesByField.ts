import * as core from '@actions/core'

import { Aggregator } from 'mingo/aggregator'
import 'mingo/init/system'

import {
  DeliveryItem,
  TimelineSubGroup,
  ConfigTimelineGroup
} from '../types/index.js'

import { getMetrics } from './getMetrics.js'

export const groupNodesByField = ({
  nodes,
  group
}: {
  nodes: DeliveryItem[]
  group: ConfigTimelineGroup
}): TimelineSubGroup[] => {
  const groups: TimelineSubGroup[] = []
  if (group.groupByField === undefined || group.groupByField === '') {
    core.info(
      `${group.name} - No group by field defined, returning an empty groups array`
    )
    return []
  }
  if (group.groupByField !== undefined) {
    core.info(`${group.name} - Groupping nodes by field: ${group.groupByField}`)

    const agg = new Aggregator([
      { $group: { _id: `$${group.groupByField}`, nodes: { $push: '$$ROOT' } } }
    ])

    const aggResult = agg.run(nodes)

    for (const stream of aggResult) {
      groups.push({
        name: stream._id === null ? 'No data available' : String(stream._id),
        description: `Group of nodes for ${group.groupByField}: ${stream._id}`,
        query: { $group: { _id: `$${group.groupByField}` } },
        nodes: stream.nodes as DeliveryItem[],
        metrics: getMetrics({ nodes: stream.nodes as DeliveryItem[] })
      })
      core.info(
        `${group.name} - Processing group ID: ${stream._id} - documents: ${(stream.nodes as DeliveryItem[]).length}`
      )
    }
  }
  return groups
}

export default groupNodesByField
