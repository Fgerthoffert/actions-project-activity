/* eslint-disable  @typescript-eslint/no-explicit-any */

import * as core from '@actions/core'
import { FlatCache } from 'flat-cache'

import {
  Config,
  GitHubProjectCard,
  GitHubPullRequest,
  DeliveryItem
} from '../types/index.js'

import { getPullRequestsGraphQL } from './graphql/getPullRequests.graphql.js'

import { getNodesByIds } from './getNodesByIds.js'
import { augmentNodes } from './augmentNodes.js'

export const getPullRequests = async ({
  inputGithubToken,
  config,
  githubProjectCards,
  dataCacheDir,
  devCache = false
}: {
  inputGithubToken: string
  config: Config
  githubProjectCards: GitHubProjectCard[]
  dataCacheDir: string
  devCache?: boolean
}): Promise<DeliveryItem[]> => {
  core.info(`Fetching all closed PRs attached to the project`)

  let deliveryItems: DeliveryItem[] = []

  const cache = new FlatCache({
    cacheId: 'cache',
    cacheDir: dataCacheDir,
    ttl: 60 * 60 * 1000
  })
  await cache.load()
  const cacheData: DeliveryItem[] = await cache.getKey('prs')

  if (devCache === true && cacheData !== undefined) {
    core.info(`PRs were found in cache. Using cached data...`)
    deliveryItems = cacheData
  } else {
    core.info(
      `No existing cache found for PRs, or caching disabled Fetching from GitHub...`
    )

    const prs: GitHubPullRequest[] = await getNodesByIds({
      inputGithubToken,
      githubIds: githubProjectCards
        .filter(
          (card: any) =>
            card.content.__typename === 'PullRequest' &&
            card.content.closedAt !== null
        )
        .map((card: any) => card.content.id),
      graphQLQuery: getPullRequestsGraphQL
    })

    // augment issues with additional data coming from the project cards
    deliveryItems = augmentNodes(prs, githubProjectCards, config.fields.points)
  }

  await cache.setKey('prs', deliveryItems)
  await cache.save()

  return deliveryItems
}

export default getPullRequests
