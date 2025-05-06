/* eslint-disable  @typescript-eslint/no-explicit-any */
import * as core from '@actions/core'

import { Query } from 'mingo'
import { Aggregator } from 'mingo/aggregator'
import 'mingo/init/system'

import { DeliveryItem, ConfigGroup, MetricStream } from '../types/index.js'

// Create buckets of nodes for each single stream
/**
 * Builds metric streams and groups nodes based on the provided configuration.
 *
 * @param {Object} params - The parameters for building streams.
 * @param {DeliveryItem[]} params.nodes - The list of delivery items to process.
 * @param {ConfigGroup} params.group - The configuration group defining how to process the nodes.
 * @returns {Object} An object containing the generated streams and the grouped nodes.
 * @returns {MetricStream[]} returns.streams - The list of metric streams generated.
 * @returns {DeliveryItem[]} returns.groupNodes - The list of nodes grouped by the configuration.
 *
 * @remarks
 * - If `group.groupByField` is defined, the nodes are grouped by the specified field using an aggregator.
 * - If `group.groupByField` is not defined, the streams are processed based on the queries defined in `group.streams`.
 * - Nodes are filtered to ensure they are not counted multiple times across streams.
 *
 * @example
 * const result = buildStreams({
 *   nodes: deliveryItems,
 *   group: configGroup
 * });
 * console.log(result.streams); // Logs the generated metric streams
 * console.log(result.groupNodes); // Logs the grouped nodes
 */
export const buildStreams = ({
  nodes,
  group
}: {
  nodes: DeliveryItem[]
  group: ConfigGroup
}): {
  streams: MetricStream[]
  groupNodes: DeliveryItem[]
} => {
  const streams: any[] = []
  let groupNodes: DeliveryItem[] = []

  if (group.groupByField !== undefined) {
    core.info(
      `${group.name} - Processing group by field: ${group.groupByField}`
    )
    let agg = new Aggregator([
      { $group: { _id: `$${group.groupByField}`, nodes: { $push: '$$ROOT' } } }
    ])
    const aggResult = agg.run(nodes)
    for (const stream of aggResult) {
      streams.push({
        name: stream._id === null ? 'No data available' : stream._id,
        description: `Stream for ${group.groupByField}: ${stream._id}`,
        query: { $group: { _id: `$${group.groupByField}` } },
        nodes: stream.nodes
      })
      core.info(
        `${group.name} - Processing group ID: ${stream._id} - documents: ${(stream.nodes as DeliveryItem[]).length}`
      )
      groupNodes = [...groupNodes, ...(stream.nodes as DeliveryItem[])]
    }
  } else {
    let srcNodes = nodes
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
      streams.push({
        ...stream,
        nodes: streamNodes
      })
      for (const node of streamNodes) {
        groupNodes.push(node)
      }
    }
  }

  return { streams: streams, groupNodes: groupNodes }
}

export default buildStreams
