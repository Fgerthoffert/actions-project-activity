import * as core from '@actions/core'

import { Config, DeliveryItem, TimelineGroup } from '../types/index.js'

import { filterNodesByQuery } from './filterNodesByQuery.js'
import { filterNodesWithoutEvents } from './filterNodesWithoutEvents.js'
import { getStatusChange } from './getStatusChange.js'
import { groupNodesByField } from './groupNodesByField.js'
import { getMetrics } from './getMetrics.js'

import { getId } from '../utils/index.js'

export const buildTimelineMetrics = async ({
  nodes,
  config
}: {
  nodes: DeliveryItem[]
  config: Config
}): Promise<TimelineGroup[]> => {
  // Begin by filtering down all of the nodes that do not contain timeline data

  nodes = filterNodesWithoutEvents({ nodes })

  const timelineGroups: TimelineGroup[] = []
  if (
    config.timeline === undefined ||
    config.timeline.groups === undefined ||
    config.timeline.groups.length === 0 ||
    config.timeline.enabled !== true
  ) {
    core.info(
      'No timeline groups defined in the configuration or timeline disabled, skipping...'
    )
    return timelineGroups
  }

  for (const group of config.timeline.groups) {
    await core.group(
      `⏳ Calculating Timeline Metrics for group: ${group.name}`,
      async () => {
        // Only process nodes that are matching the query configured for the group
        let nodesInGroup = filterNodesByQuery({
          nodes,
          group
        })

        // Calculate the status change for each of the group nodes
        // This also removed all nodes for which the status change could not be determined
        nodesInGroup = getStatusChange({ nodes: nodesInGroup, group })

        const groups = groupNodesByField({
          nodes: nodesInGroup,
          group
        })

        timelineGroups.push({
          ...group,
          updatedAt: new Date().toJSON(),
          id: getId(group.name),
          field: group.groupByField ?? '', // Add this line to satisfy TimelineGroup interface
          nodes: nodesInGroup,
          groups: groups,
          metrics: getMetrics({ nodes: nodesInGroup })
        })

        return null
      }
    )
  }

  return timelineGroups
}

export default buildTimelineMetrics
