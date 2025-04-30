/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */

import * as core from '@actions/core'
import { FlatCache } from 'flat-cache'

import { getIssuesGraphQL } from './graphql/getIssuesGraphQL'
import { getNodesByIds, augmentNodes } from './'

export const getIssues = async ({
  octokit,
  config,
  githubProjectCards,
  dataCacheDir,
  devCache = false
}: {
  octokit: any
  config: any
  githubProjectCards: any[]
  dataCacheDir: string
  devCache?: boolean
}): Promise<any> => {
  core.info(`Fetching all closed issues attached to the project`)

  let issues: any = []

  const cache = new FlatCache({
    cacheId: 'cache',
    cacheDir: dataCacheDir,
    ttl: 60 * 60 * 1000
  })
  await cache.load()
  const cacheData = await cache.getKey('issues')

  if (devCache === true && cacheData !== undefined) {
    core.info(`Issues were found in cache. Using cached data...`)
    issues = cacheData
  } else {
    core.info(
      `No existing cache found for issues, or caching disabled Fetching from GitHub...`
    )

    issues = await getNodesByIds({
      octokit,
      githubIds: githubProjectCards
        .filter(
          (card: any) =>
            card.content.__typename === 'Issue' &&
            card.content.closedAt !== null
        )
        .map((card: any) => card.content.id),
      graphQLQuery: getIssuesGraphQL
    })

    // augment issues with additional data coming from the project cards
    issues = augmentNodes(issues, githubProjectCards, config.fields.points)
  }

  await cache.setKey('issues', issues)
  await cache.save()

  return issues
}

export default getIssues
