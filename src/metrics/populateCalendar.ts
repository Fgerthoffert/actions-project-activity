/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */

import { add } from 'date-fns'

export const populateCalendar = (nodes: any[], calendar: any[]): any => {
  return calendar.map((week) => {
    const weekStartDate = week.firstDay
    const weekEndDate = add(weekStartDate, { days: 7 })

    const weekNodes = nodes.filter((node) => {
      const closedAt = new Date(node.closedAt)
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
            .map((i: any) => i.points)
            .reduce((acc: any, count: any) => acc + count, 0)
        }
      }
    }
  })
}

export default populateCalendar
