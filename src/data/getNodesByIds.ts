/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */

import * as core from '@actions/core'
import { Octokit } from '@octokit/core'

import {
  GitHubRateLimit,
  GitHubIssue,
  GitHubPullRequest
} from '../types/index.js'

import { chunkArray, sleep } from '../utils/index.js'
import { processRateLimit } from './processRateLimit.js'

interface GitHubNodeResponse {
  nodes: GitHubIssue[] | GitHubPullRequest[]
  rateLimit: GitHubRateLimit
}

export const getNodesByIds = async ({
  octokit,
  githubIds,
  graphQLQuery,
  increment = 50,
  rateLimit = {
    limit: 5000,
    cost: 1,
    remaining: 5000,
    resetAt: null
  }
}: {
  octokit: Octokit
  githubIds: string[]
  graphQLQuery: any
  increment?: number
  rateLimit?: GitHubRateLimit
}): Promise<any> => {
  // After 3 consecutive API calls failures, stop the process with an error
  const maxRetries = 3
  let fetchedNodes: GitHubIssue[] | GitHubPullRequest[] = []

  // This received an array of node ids, will split the array in chunks of X
  core.info(`Will be collecting details about ${githubIds.length} nodes`)
  core.info(`Chunking the array of node ids into chunks of ${increment}`)
  const idsChunks = chunkArray(githubIds, increment)
  for (const idsChunk of idsChunks) {
    core.info(`Will be fetching details about ${idsChunk.length} nodes`)
    let retries = 0
    let updatedData: any[] = []
    while (updatedData.length === 0 && retries < maxRetries) {
      await processRateLimit(rateLimit)
      core.info(
        `Loading ${idsChunk.length} repos from GitHub ${fetchedNodes.length + idsChunk.length} / ${githubIds.length} ${retries > 0 ? ' - API error, retry: ' + retries + '/' + maxRetries : ''}`
      )
      const t0 = performance.now()
      const graphQLResponse = await octokit
        .graphql<GitHubNodeResponse>(graphQLQuery, { nodesArray: idsChunk })
        .catch((error: Error) => {
          core.error(error.message)
        })
      const t1 = performance.now()
      const callDuration = t1 - t0
      if (
        graphQLResponse &&
        'rateLimit' in graphQLResponse &&
        graphQLResponse.rateLimit !== undefined
      ) {
        rateLimit = graphQLResponse.rateLimit
      }
      if (
        graphQLResponse !== undefined &&
        graphQLResponse.nodes !== undefined &&
        graphQLResponse.nodes.length > 0
      ) {
        const apiPerf = Math.round(
          graphQLResponse.nodes.length / (callDuration / 1000)
        )
        core.info(
          `Latest call contained ${graphQLResponse.nodes.length} nodes, download rate: ${apiPerf} nodes/s`
        )
        updatedData = graphQLResponse.nodes
      }
      retries++
    }
    if (updatedData.length > 0) {
      fetchedNodes = [...fetchedNodes, ...updatedData]
      await sleep(1000)
      core.info(
        `Fetched ${fetchedNodes.length} nodes so far, rate limit: ${rateLimit.remaining} remaining`
      )
    } else {
      core.error(`Failed to fetch data after ${maxRetries} retries. Exiting...`)
      return []
    }
  }
  return fetchedNodes
}

export default getNodesByIds
