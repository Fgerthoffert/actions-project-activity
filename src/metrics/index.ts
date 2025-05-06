import * as core from '@actions/core'

import {
  Config,
  DeliveryItem,
  MetricGroup,
  MetricStream
} from '../types/index.js'

import { buildGroup } from './buildGroup.js'
import { buildStreams } from './buildStreams.js'
import { buildEmptyCalendar } from './buildEmptyCalendar.js'
import { populateCalendar } from './populateCalendar.js'
import { buildMovingAverage } from './buildMovingAverage.js'
import { buildDistribution } from './buildDistribution.js'

import { getId } from '../utils/index.js'

export const buildMetrics = async ({
  nodes,
  config
}: {
  nodes: DeliveryItem[]
  config: Config
}): Promise<MetricGroup[]> => {
  // Create an array containing all metrics across all groups
  const allMetrics: MetricGroup[] = []
  for (const group of config.groups) {
    await core.group(
      `⏳ Calculating metrics for group: ${group.name}`,
      async () => {
        const srcGroupNodes = buildGroup({ nodes, group })

        // Begin by generating an array of streams including their corresponding nodes
        // groupNodes contains all nodes that belong to the group (across all streams)
        let { streams: groupStreams, groupNodes } = buildStreams({
          nodes: srcGroupNodes,
          group
        })

        // The calendar must span the entire group, not just one stream
        const calendar = buildEmptyCalendar(groupNodes)

        // Once the calendar containing all weeks across all streams is built,
        // we can populate it with the metrics from each stream
        groupStreams = groupStreams.map((stream: MetricStream) => {
          const streamCalendar = populateCalendar(stream.nodes, calendar)
          const streamCalendarWithMovingAverage = buildMovingAverage(
            streamCalendar,
            config.movingWindow
          )
          return {
            ...stream,
            weeks: streamCalendarWithMovingAverage
          }
        })

        const calendarMetrics = populateCalendar(groupNodes, calendar)
        const groupCalendarWithMovingAverage = buildMovingAverage(
          calendarMetrics,
          config.movingWindow
        )
        const groupMetrics = {
          ...group,
          id: getId(group.name),
          name: group.name,
          description: group.description,
          updatedAt: new Date().toJSON(),
          nodes: groupNodes,
          weeks: groupCalendarWithMovingAverage,
          streams: buildDistribution(
            groupCalendarWithMovingAverage,
            groupStreams
          )
        }
        allMetrics.push(groupMetrics)

        return null
      }
    )
  }
  return allMetrics
}

export default buildMetrics
