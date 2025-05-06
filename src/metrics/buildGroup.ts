import * as core from '@actions/core'

import { Query } from 'mingo'
import 'mingo/init/system'

import { DeliveryItem, ConfigGroup } from '../types/index.js'

/**
 * Filters and groups delivery items based on a specified query.
 *
 * @param params - The parameters for building the group.
 * @param params.nodes - An array of `DeliveryItem` objects to be filtered.
 * @param params.group - The configuration group containing the query and metadata.
 * @returns An array of `DeliveryItem` objects that match the query defined in the group.
 *
 * @remarks
 * - If the `group.query` is undefined, all nodes are returned without filtering.
 * - Logs the number of nodes before and after applying the query for debugging purposes.
 *
 * @example
 * ```typescript
 * const nodes: DeliveryItem[] = [...];
 * const group: ConfigGroup = { name: "Example Group", query: { ... } };
 * const filteredNodes = buildGroup({ nodes, group });
 * console.log(filteredNodes);
 * ```
 */
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
