/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */

import * as core from '@actions/core'

import { Query } from 'mingo'
import 'mingo/init/system'

import {
  buildEmptyCalendar,
  populateCalendar,
  buildMovingAverage,
  buildDistribution
} from './'
import { getId } from '../utils'

export const buildMetrics = async ({
  nodes,
  config
}: {
  nodes: any
  config: any
}): Promise<string> => {
  // Create an array containing all metrics across all groups
  const allMetrics: any = []
  for (const group of config.groups) {
    await core.group(`Processing group: ${group.name}`, async () => {
      let srcNodes = nodes
      let groupNodes: any = []
      let groupStreams = []
      for (const stream of group.streams) {
        let streamNodes = new Query(stream.query).find(srcNodes).all()
        // In the source nodes, remove the nodes that are already in the stream
        // This makes sure nodes are not counted multiple times
        srcNodes = srcNodes.filter(
          (node: any) => !streamNodes.find((n: any) => n.id === node.id)
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
        id: getId(group.name),
        name: group.name,
        description: group.description,
        updatedAt: new Date().toJSON(),
        nodes: groupNodes,
        weeks: groupCalendarWithMovingAverage,
        streams: buildDistribution(groupCalendarWithMovingAverage, groupStreams)
      }
      allMetrics.push(groupMetrics)

      // console.log('-----------------------------------')
      // console.log(JSON.stringify(groupMetrics))
      // console.log('-----------------------------------')
      return null
    })
  }
  return allMetrics
}

export default buildMetrics
