/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */

import * as core from '@actions/core'
import { FlatCache } from 'flat-cache'

import { getPullRequestsGraphQL } from './graphql/getPullRequestsGraphQL'
import { getNodesByIds, augmentNodes } from './'

export const getPullRequests = async ({
  octokit,
  config,
  githubProjectCards,
  dataCacheDir,
  devCache = false
}: {
  octokit: any
  config: any
  githubProjectCards: string[]
  dataCacheDir: string
  devCache?: boolean
}): Promise<any> => {
  core.info(`Fetching all closed PRs attached to the project`)

  let prs: any = []

  const cache = new FlatCache({
    cacheId: 'cache',
    cacheDir: dataCacheDir,
    ttl: 60 * 60 * 1000
  })
  await cache.load()
  const cacheData = await cache.getKey('prs')

  if (devCache === true && cacheData !== undefined) {
    core.info(`PRs were found in cache. Using cached data...`)
    prs = cacheData
  } else {
    core.info(
      `No existing cache found for PRs, or caching disabled Fetching from GitHub...`
    )

    prs = await getNodesByIds({
      octokit,
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
    prs = augmentNodes(prs, githubProjectCards, config.fields.points)
  }

  await cache.setKey('prs', prs)
  await cache.save()

  return prs
}

export default getPullRequests
