/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */

import * as core from '@actions/core'
import { Octokit } from '@octokit/core'
import { paginateGraphQL } from '@octokit/plugin-paginate-graphql'

import { FlatCache } from 'flat-cache'

import { getProjectCardsGraphQL } from './graphql/getProjectCardsGraphQL'

export const getProjectCards = async ({
  inputGithubToken,
  projectId,
  increment = 70,
  dataCacheDir,
  devCache = false
}: {
  inputGithubToken: string
  projectId: string
  increment?: number
  dataCacheDir: string
  devCache?: boolean
}): Promise<any> => {
  const MyOctokit = Octokit.plugin(paginateGraphQL)
  const octokit = new MyOctokit({ auth: inputGithubToken })

  let projectCards: any = []

  core.info(`Fetching all cards for project ID: ${projectId}`)

  const cache = new FlatCache({
    cacheId: 'cache',
    cacheDir: dataCacheDir,
    ttl: 60 * 60 * 1000
  })
  await cache.load()
  const cacheData = await cache.getKey('projectCards')

  if (devCache === true && cacheData !== undefined) {
    core.info(`Project cards were found in cache. Using cached data...`)
    projectCards = cacheData
  } else {
    core.info(
      `No existing cache found for project cards, or caching disabled Fetching from GitHub...`
    )

    const graphQLResponse: any = await octokit.graphql
      .paginate(
        //.graphql(
        getProjectCardsGraphQL,
        { projectId: projectId, increment: increment }
      )
      .catch((error: Error) => {
        core.error(error.message)
      })
    projectCards =
      graphQLResponse?.node?.items?.edges.map((edge: any) => edge.node) || []
  }

  await cache.setKey('projectCards', projectCards)
  await cache.save()

  return projectCards
}

export default getProjectCards
