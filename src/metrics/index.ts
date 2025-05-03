import * as core from '@actions/core'

import { Query } from 'mingo'
import 'mingo/init/system'

import { Config, DeliveryItem, MetricGroup } from '../types/index.js'

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
        let srcNodes = nodes
        let groupNodes: DeliveryItem[] = []
        let groupStreams = []
        for (const stream of group.streams) {
          const streamNodes: DeliveryItem[] = new Query(stream.query)
            .find(srcNodes)
            .all() as DeliveryItem[]

          // In the source nodes, remove the nodes that are already in the stream
          // This makes sure nodes are not counted multiple times
          srcNodes = srcNodes.filter(
            (node) => !streamNodes.find((n) => n.id === node.id)
          )
          core.info(
            `${group.name} - Processing stream: ${stream.name} (${stream.description}) - documents: ${streamNodes.length}`
          )
          groupStreams.push({
            ...stream,
            nodes: streamNodes
          })
          groupNodes = [...groupNodes, ...streamNodes]
        }

        // The calendar must span the entire group, not just one stream
        const calendar = buildEmptyCalendar(groupNodes)

        // Once the calendar containing all weeks across all streams is built,
        // we can populate it with the metrics from each stream
        groupStreams = groupStreams.map((stream) => {
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
