import * as core from '@actions/core'

import { DeliveryItem } from '../types/index.js'

export const getStatusChange = ({
  nodes,
  group
}: {
  nodes: DeliveryItem[]
  group: any
}): DeliveryItem[] => {
  const eliligibleNodes: DeliveryItem[] = []

  for (const node of nodes) {
    // If the node does not have a timeline, skip it
    if (node.timeline === undefined || node.timeline.events.length === 0) {
      core.info(
        `Node ${node.title} does not have a timeline or events, skipping`
      )
      continue
    }

    // A node is eligible if it has a timeline and the timeline contains events
    // of the right type for the right field
    let startEvent = null
    let endEvent = null

    // create an array called sorted events, that contains all node.timeline.events sorted by the date field, in descending order. The date is a string with the format "2025-05-28T12:46:32Z"
    const sortedEvents = [...node.timeline.events].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

    for (const event of sortedEvents) {
      if (
        event.action === 'edited' &&
        event.change?.field_value?.field_name === group.field
      ) {
        if (startEvent === null) {
          if (event.change?.field_value?.to?.name === group.valueFrom) {
            startEvent = {
              date: event.date,
              valueFrom: event.change?.field_value?.to?.name
            }
          }
        }
        if (endEvent === null) {
          // If no valueTo is provided, we're tracking the time between the node moved
          // into the status, to the time it left the status
          if (
            group.valueTo === undefined &&
            event.change?.field_value?.from?.name === group.valueFrom
          ) {
            endEvent = {
              date: event.date,
              valueTo: event.change?.field_value?.to?.name
            }
          }
          if (event.change?.field_value?.to?.name === group.valueTo) {
            endEvent = {
              date: event.date,
              valueTo: event.change?.field_value?.to?.name
            }
          }
        }
      }
    }

    if (startEvent && endEvent && startEvent.valueFrom && endEvent.valueTo) {
      eliligibleNodes.push({
        ...node,
        timelineMetrics: {
          startDate: startEvent.date,
          endDate: endEvent.date,
          duration: (() => {
            const startDate = new Date(startEvent.date)
            const endDate = new Date(endEvent.date)

            let businessDays = 0
            let currentDate = new Date(startDate.getTime())

            while (currentDate <= endDate) {
              const dayOfWeek = currentDate.getDay()
              // Only count weekdays (Monday-Friday)
              if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                businessDays++
              }
              currentDate.setDate(currentDate.getDate() + 1)
            }

            return businessDays
          })(),
          valueFrom: startEvent?.valueFrom,
          valueTo: endEvent?.valueTo
        }
      })
    }
  }
  return eliligibleNodes
}

export default getStatusChange
