/* eslint-disable  @typescript-eslint/no-explicit-any */

import { MetricWeek, DeliveryItem } from '../types/index.js'

/**
 * Calculates a moving average for a given calendar of metric weeks.
 * The moving average is computed over a specified window of weeks.
 *
 * @param calendar - An array of `MetricWeek` objects representing the calendar data.
 *                   Each `MetricWeek` contains nodes and metrics information.
 * @param window - The size of the moving window (default is 6).
 *                 Determines how many weeks are considered for the moving average calculation.
 * @returns A new array of `MetricWeek` objects with updated metrics, including:
 *          - `velocityWindow`: The number of weeks included in the moving window.
 *          - `velocityNodes`: The combined nodes from the moving window.
 *          - `metrics.nodes.velocity`: The average number of nodes per week in the moving window.
 *          - `metrics.points.velocity`: The average points per week in the moving window.
 */
export const buildMovingAverage = (
  calendar: MetricWeek[],
  window: number = 6
): MetricWeek[] => {
  return calendar.map((week, index) => {
    let movingNodes: DeliveryItem[] = []
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
                .map((i: any) => (i.points === null ? 0 : i.points))
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
