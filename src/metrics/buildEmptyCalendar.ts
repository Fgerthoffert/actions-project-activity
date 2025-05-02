import * as core from '@actions/core'
import { startOfWeek, add } from 'date-fns'

import { MetricWeek, DeliveryItem } from '../types/index.js'

/**
 * Generates an array of empty MetricWeek objects for each week between the specified start and end dates.
 *
 * @param startDate - The starting date for generating weeks. The first week will begin at the start of the week containing this date.
 * @param endDate - The ending date for generating weeks. Weeks will be generated up to, but not including, this date.
 * @returns An array of MetricWeek objects, each representing a week with initialized empty metrics and nodes.
 */
export const getEmptyWeeks = (startDate: Date, endDate: Date): MetricWeek[] => {
  let dateCursor = startOfWeek(startDate)
  const weeks: MetricWeek[] = []
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

/**
 * Builds an empty calendar object spanning from the earliest closed date
 * to the latest closed date found in the provided delivery items.
 *
 * @param nodes - An array of `DeliveryItem` objects, each potentially containing a `closedAt` date.
 * @returns An array of `MetricWeek` objects representing the empty calendar.
 *
 * @remarks
 * - The function filters out `null` or `undefined` `closedAt` dates from the input.
 * - Dates are sorted in ascending order to determine the range.
 * - Logs the range of dates used for the placeholder calendar.
 */
export const buildEmptyCalendar = (nodes: DeliveryItem[]): MetricWeek[] => {
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
    .sort((a: Date, b: Date) => a.getTime() - b.getTime())
  const firstClosedDate = new Date(sortedDates[0])
  const lastClosedDate = new Date(sortedDates[sortedDates.length - 1])

  core.info(
    `Preparing a placeholder empty calendar between ${firstClosedDate} and ${lastClosedDate}`
  )
  const calendar = getEmptyWeeks(firstClosedDate, lastClosedDate)

  return calendar
}

export default buildEmptyCalendar
