/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */

import * as core from '@actions/core'
import { Octokit } from '@octokit/core'
import { FlatCache } from 'flat-cache'

import {
  Config,
  GitHubProjectCard,
  GitHubIssue,
  DeliveryItem
} from '../types/index.js'

import { getIssuesGraphQL } from './graphql/getIssues.graphql.js'

import { getNodesByIds } from './getNodesByIds.js'
import { augmentNodes } from './augmentNodes.js'

export const getIssues = async ({
  octokit,
  config,
  githubProjectCards,
  dataCacheDir,
  devCache = false
}: {
  octokit: Octokit
  config: Config
  githubProjectCards: GitHubProjectCard[]
  dataCacheDir: string
  devCache?: boolean
}): Promise<DeliveryItem[]> => {
  core.info(`Fetching all closed issues attached to the project`)

  let deliveryItems: DeliveryItem[] = []

  const cache = new FlatCache({
    cacheId: 'cache',
    cacheDir: dataCacheDir,
    ttl: 60 * 60 * 1000
  })
  await cache.load()
  const cacheData: DeliveryItem[] = await cache.getKey('issues')

  if (devCache === true && cacheData !== undefined) {
    core.info(`Issues were found in cache. Using cached data...`)
    deliveryItems = cacheData
  } else {
    core.info(
      `No existing cache found for issues, or caching disabled Fetching from GitHub...`
    )

    const issues: GitHubIssue[] = await getNodesByIds({
      octokit,
      githubIds: githubProjectCards
        .filter(
          (card) =>
            card.content !== null &&
            card.content?.__typename === 'Issue' &&
            card.content?.closedAt !== null
        )
        .map((card) => card.content?.id)
        .filter((id): id is string => id !== undefined),
      graphQLQuery: getIssuesGraphQL
    })

    // Augment issues with additional data coming from the project cards
    deliveryItems = augmentNodes(
      issues,
      githubProjectCards,
      config.fields.points
    )
  }

  await cache.setKey('issues', deliveryItems)
  await cache.save()

  return deliveryItems
}

export default getIssues
