/* eslint-disable  @typescript-eslint/no-explicit-any */
import * as core from '@actions/core'

import { Query } from 'mingo'
import 'mingo/init/system'

import { DeliveryItem, ConfigGroup } from '../types/index.js'

export const buildGroup = ({
  nodes,
  group
}: {
  nodes: DeliveryItem[]
  group: ConfigGroup
}): DeliveryItem[] => {
  if (group.query === undefined) {
    core.info('No query defined for group, returning all nodes')
    return nodes
  }
  core.info(
    `${group.name} - Processing group with query: ${JSON.stringify(
      group.query
    )}`
  )

  core.info(`Number of nodes before query: ${nodes.length}`)
  const groupNodes: DeliveryItem[] = new Query(group.query)
    .find(nodes)
    .all() as DeliveryItem[]
  core.info(`Number of nodes after query: ${groupNodes.length}`)

  return groupNodes
}

export default buildGroup
