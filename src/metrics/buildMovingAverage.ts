/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */

export const buildMovingAverage = (
  calendar: any[],
  window: number = 6
): any => {
  return calendar.map((week, index) => {
    let movingNodes: any = []
    let movingWindow = 0
    for (let i = 0; i < window; i++) {
      const movingIndex = index - i
      if (calendar[movingIndex] !== undefined) {
        movingWindow++
        movingNodes = [...movingNodes, ...calendar[movingIndex].nodes]
      }
    }
    return {
      ...week,
      metrics: {
        ...week.metrics,
        velocityWindow: movingWindow,
        velocityNodes: movingNodes,
        nodes: {
          ...week.metrics.nodes,
          velocity: Math.round((movingNodes.length / movingWindow) * 10) / 10
        },
        points: {
          ...week.metrics.points,
          velocity:
            Math.round(
              (movingNodes
                .map((i: any) => i.points)
                .reduce((acc: any, count: any) => acc + count, 0) /
                movingWindow) *
                10
            ) / 10
        }
      }
    }
  })
}

export default buildMovingAverage
