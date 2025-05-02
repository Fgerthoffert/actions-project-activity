import * as core from '@actions/core'
import { Octokit } from '@octokit/core'
import { paginateGraphQL } from '@octokit/plugin-paginate-graphql'

import { FlatCache } from 'flat-cache'

import { GitHubProjectCard, GitHubProjectCardEdge } from '../types/index.js'

import {
  getProjectCardsGraphQL,
  ProjectCardsResponse
} from './graphql/getProjectCards.graphql.js'

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
}): Promise<GitHubProjectCard[]> => {
  const MyOctokit = Octokit.plugin(paginateGraphQL)
  const octokit = new MyOctokit({ auth: inputGithubToken })

  let projectCards: GitHubProjectCard[] = []

  core.info(`Fetching all cards for project ID: ${projectId}`)

  // FlatCache is useful during development to avoid hitting the GitHub API too often
  // and to speed up the process. It is not recommended to use it in production.
  const cache = new FlatCache({
    cacheId: 'cache',
    cacheDir: dataCacheDir,
    ttl: 60 * 60 * 1000
  })
  await cache.load()
  const cacheData: GitHubProjectCard[] = await cache.getKey('projectCards')

  if (devCache === true && cacheData !== undefined) {
    core.info(`Project cards were found in cache. Using cached data...`)
    projectCards = cacheData
  } else {
    core.info(
      `No existing cache found for project cards, or caching disabled Fetching from GitHub...`
    )

    const graphQLResponse: ProjectCardsResponse = await octokit.graphql
      .paginate(
        //.graphql(
        getProjectCardsGraphQL,
        { projectId: projectId, increment: increment }
      )
      .catch((error: Error) => {
        core.error(error.message)
      })
    projectCards =
      graphQLResponse?.node?.items?.edges.map(
        (edge: GitHubProjectCardEdge) => edge.node
      ) || []
  }

  await cache.setKey('projectCards', projectCards)
  await cache.save()

  return projectCards
}

export default getProjectCards
