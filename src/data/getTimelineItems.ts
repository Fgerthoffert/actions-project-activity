import * as core from '@actions/core'
import { FlatCache } from 'flat-cache'

import { Config, DeliveryItem, DeliveryTimeline } from '../types/index.js'

export const getTimelineItems = async ({
  config,
  deliveryItems,
  dataCacheDir,
  devCache = false
}: {
  config: Config
  deliveryItems: DeliveryItem[]
  dataCacheDir: string
  devCache?: boolean
}): Promise<DeliveryItem[]> => {
  core.info(
    `Attempting to fetch all timeline items from the provided GitHub issues`
  )

  let deliveryItemWithTimeline: DeliveryItem[] = []

  const cache = new FlatCache({
    cacheId: 'cache',
    cacheDir: dataCacheDir,
    ttl: 60 * 60 * 1000
  })
  await cache.load()
  const cacheData: DeliveryItem[] = await cache.getKey('issues-timeline')

  if (devCache === true && cacheData !== undefined) {
    core.info(
      `Issues with Timeline items were found in cache. Using cached data...`
    )
    deliveryItemWithTimeline = cacheData
  } else if (config.timeline !== undefined) {
    core.info(
      `No existing cache found for issues, or caching disabled, fetching from ${config.timeline.baseUrl}...`
    )
    for (const issue of deliveryItems) {
      core.info(`Processing issue: ${issue.title} (ID: ${issue.id})`)

      let issueTimeline = undefined
      try {
        const issueUrl = `${config.timeline.baseUrl}/${issue.repository.owner.login}/${issue.repository.name}/json/${issue.number}.json`
        const response = await fetch(issueUrl)
        if (response.ok) {
          issueTimeline = await response.json()
        } else {
          core.info(
            `Failed to fetch timeline for issue ${issue.id}: ${response.statusText} - ${issueUrl}`
          )
        }
      } catch (error) {
        core.info(`Error fetching timeline for issue ${issue.id}: ${error}`)
      }

      deliveryItemWithTimeline.push({
        ...issue,
        timeline: issueTimeline as DeliveryTimeline | undefined
      })
    }
  }

  await cache.setKey('issues-timeline', deliveryItemWithTimeline)
  await cache.save()

  return deliveryItemWithTimeline
}

export default getTimelineItems
