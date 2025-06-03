import * as core from '@actions/core'

import { DeliveryItem } from '../types/index.js'

export const filterNodesWithoutEvents = ({
  nodes
}: {
  nodes: DeliveryItem[]
}): DeliveryItem[] => {
  const filteredNodes = nodes.filter(
    (node: DeliveryItem) => node.timeline && node.timeline.events.length > 0
  )
  core.info(
    `Filtered nodes with events: ${filteredNodes.length} (Total number of nodes: ${nodes.length})`
  )
  return filteredNodes
}

export default filterNodesWithoutEvents
