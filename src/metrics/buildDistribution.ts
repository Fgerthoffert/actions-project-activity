/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */

export const buildDistribution = (
  allNodesWeeks: any[],
  streams: any[]
): any => {
  return streams.map((stream) => {
    return {
      ...stream,
      weeks: stream.weeks.map((week: any) => {
        const allNodesWeek = allNodesWeeks.find(
          (w: any) => w.firstDay === week.firstDay
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
