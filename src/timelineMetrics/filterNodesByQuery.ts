import * as core from '@actions/core'

import { Query } from 'mingo'
import 'mingo/init/system'

import { DeliveryItem } from '../types/index.js'

export const filterNodesByQuery = ({
  nodes,
  group
}: {
  nodes: DeliveryItem[]
  group: any
}): DeliveryItem[] => {
  if (group.query === undefined) {
    core.info('No query defined for group, returning all nodes')
    return nodes
  }

  const groupNodes: DeliveryItem[] = new Query(group.query)
    .find(nodes)
    .all() as DeliveryItem[]

  core.info(
    `Filtered nodes by query: ${groupNodes.length} (Total number of nodes: ${nodes.length}) - Query: ${JSON.stringify(
      group.query
    )}`
  )

  return groupNodes
}

export default filterNodesByQuery
