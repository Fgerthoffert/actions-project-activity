/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */

import * as core from '@actions/core'

import { startOfWeek, add, isEqual, differenceInWeeks, sub } from 'date-fns'

const getEmptyWeeks = (startDate: Date, endDate: Date): any[] => {
  let dateCursor = startOfWeek(startDate)
  const weeks: Array<any> = []
  while (dateCursor < endDate) {
    weeks.push({
      firstDay: dateCursor,
      nodes: [],
      metrics: {
        nodes: {
          count: 0,
          velocity: 0,
          distribution: 0
        },
        points: {
          count: 0,
          velocity: 0,
          distribution: 0
        }
      }
    })
    dateCursor = add(dateCursor, { days: 7 })
  }
  return weeks
}

export const buildEmptyCalendar = (nodes: any[]): any => {
  // Returns an empty calendar object between first closed date last closed date
  const allDates = nodes.map((node) => {
    if (node.closedAt !== undefined && node.closedAt !== null) {
      return new Date(node.closedAt)
    }
    return null
  })

  const sortedDates = allDates
    .filter((date) => date !== null)
    .map((date) => new Date(date))
    .sort((a: Date, b: Date) => a - b)
  const firstClosedDate = new Date(sortedDates[0])
  const lastClosedDate = new Date(sortedDates[sortedDates.length - 1])

  core.info(
    `Preparing a placeholder empty calendar between ${firstClosedDate} and ${lastClosedDate}`
  )
  const calendar = getEmptyWeeks(firstClosedDate, lastClosedDate)

  return calendar
}

export default buildEmptyCalendar
