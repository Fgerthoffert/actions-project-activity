import { DeliveryItem, TimelineMetrics } from '../types/index.js'

const median = (arr: number[]) => {
  if (arr.length === 0) return 0
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}

export const getMetrics = ({
  nodes
}: {
  nodes: DeliveryItem[]
}): TimelineMetrics | undefined => {
  const groupDatapoints = nodes
    .map((node: DeliveryItem) => node.timelineMetrics?.duration)
    .filter((duration): duration is number => duration !== undefined)

  if (groupDatapoints.length === 0) {
    return undefined
  }

  // Sort the datapoints
  const sortedDatapoints = [...groupDatapoints].sort((a, b) => a - b)

  // Keep 90% of the lowest values
  const cutoffIndex = Math.floor(sortedDatapoints.length * 0.9)
  const lowest90Percent = sortedDatapoints.slice(0, cutoffIndex)

  return {
    datapoints: groupDatapoints,
    median: median(groupDatapoints),
    min: Math.min(...groupDatapoints),
    max: Math.max(...groupDatapoints),
    l90: {
      datapoints: lowest90Percent,
      min: Math.min(...lowest90Percent),
      max: Math.max(...lowest90Percent),
      median: median(lowest90Percent)
    }
  }
}

export default getMetrics
