import { MetricStream, MetricWeek } from '../types/index.js'

export const buildDistribution = (
  allNodesWeeks: MetricWeek[],
  streams: MetricStream[]
): MetricStream[] => {
  return streams.map((stream) => {
    return {
      ...stream,
      weeks: stream.weeks.map((week) => {
        const allNodesWeek = allNodesWeeks.find(
          (w) => w.firstDay === week.firstDay
        )
        if (allNodesWeek) {
          return {
            ...week,
            metrics: {
              ...week.metrics,
              nodes: {
                ...week.metrics.nodes,
                distribution:
                  Math.round(
                    (week.metrics.nodes.count /
                      allNodesWeek.metrics.nodes.count) *
                      100 *
                      100
                  ) / 100
              },
              points: {
                ...week.metrics.points,
                distribution:
                  Math.round(
                    (week.metrics.points.count /
                      allNodesWeek.metrics.points.count) *
                      100 *
                      100
                  ) / 100
              }
            }
          }
        }
        return week
      })
    }
  })
}

export default buildDistribution
