/* eslint-disable  @typescript-eslint/no-explicit-any */

import { add } from 'date-fns'

import { MetricWeek, DeliveryItem } from '../types/index.js'

/**
 * Populates a calendar with delivery items and calculates metrics for each week.
 *
 * @param nodes - An array of `DeliveryItem` objects, each representing a delivery item with a `closedAt` date and other properties.
 * @param calendar - An array of `MetricWeek` objects, each representing a week with a start date, metrics, and other properties.
 * @returns A new array of `MetricWeek` objects, where each week includes the filtered delivery items (`nodes`) and updated metrics.
 *
 * The function processes each week in the calendar by:
 * - Determining the start and end dates of the week.
 * - Filtering the delivery items (`nodes`) that were closed within the week.
 * - Updating the week's metrics to include:
 *   - The count of delivery items (`nodes`) closed during the week.
 *   - The total points of the delivery items closed during the week.
 */
export const populateCalendar = (
  nodes: DeliveryItem[],
  calendar: MetricWeek[]
): MetricWeek[] => {
  return calendar.map((week) => {
    const weekStartDate = week.firstDay
    const weekEndDate = add(weekStartDate, { days: 7 })

    const weekNodes = nodes.filter((node) => {
      const closedAt = node.closedAt ? new Date(node.closedAt) : new Date(0)
      return closedAt >= weekStartDate && closedAt < weekEndDate
    })

    return {
      ...week,
      nodes: weekNodes,
      metrics: {
        nodes: {
          ...week.metrics.nodes,
          count: weekNodes.length
        },
        points: {
          ...week.metrics.points,
          count: weekNodes
            .map((i: any) => (i.points === null ? 0 : i.points))
            .reduce((acc: any, count: any) => acc + count, 0)
        }
      }
    }
  })
}

export default populateCalendar
