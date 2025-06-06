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
      `No existing cache found for issues, or caching disabled, fetching from ${config.timeline.remote.baseUrl}...`
    )
    for (const issue of deliveryItems) {
      let issueTimeline = undefined
      const issueUrl = `${config.timeline.remote.baseUrl}/${issue.repository.owner.login}/${issue.repository.name}/json/${issue.number}.json`
      let error: string | undefined = ''
      try {
        const headers: Record<string, string> = {}
        if (
          config.timeline.remote.username &&
          config.timeline.remote.username !== '' &&
          config.timeline.remote.password &&
          config.timeline.remote.password !== ''
        ) {
          const credentials = Buffer.from(
            `${config.timeline.remote.username}:${config.timeline.remote.password}`
          ).toString('base64')
          headers['Authorization'] = `Basic ${credentials}`
        }
        const response = await fetch(issueUrl, { headers })
        if (response.ok) {
          issueTimeline = await response.json()
        } else {
          error = ` - Failed to fetch timeline for issue ${response.statusText} - ${issueUrl}`
        }
      } catch (error) {
        core.info(`Error fetching timeline for issue ${issue.id}: ${error}`)
      }
      core.info(
        `${error === '' ? '✅' : '❌'} Processed issue: ${issue.title} (ID: ${issue.id})${error}`
      )

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
