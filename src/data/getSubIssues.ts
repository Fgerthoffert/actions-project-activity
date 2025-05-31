import * as core from '@actions/core'
import { Octokit } from '@octokit/core'
import { paginateGraphQL } from '@octokit/plugin-paginate-graphql'

import { FlatCache } from 'flat-cache'

import { GitHubIssue, GitHubSubIssueEdge } from '../types/index.js'

import {
  getSubIssuesGraphQL,
  SubIssuesResponse
} from './graphql/getSubIssues.graphql.js'

const queryForSubIssues = async ({
  inputGithubToken,
  issueId,
  subIssues
}: {
  inputGithubToken: string
  issueId: string
  subIssues: string[]
}): Promise<string[]> => {
  const MyOctokit = Octokit.plugin(paginateGraphQL)
  const octokit = new MyOctokit({ auth: inputGithubToken })

  const graphQLResponse: SubIssuesResponse = await octokit.graphql
    .paginate(
      //.graphql(
      getSubIssuesGraphQL,
      { issueId: issueId, increment: 50 }
    )
    .catch((error: Error) => {
      core.error(error.message)
    })
  const newSubIssues: GitHubIssue[] =
    graphQLResponse?.node?.subIssues?.edges.map(
      (edge: GitHubSubIssueEdge) => edge.node
    ) || []

  if (newSubIssues.length === 0) {
    core.info(`No sub issues found for issue ID: ${issueId}`)
    return subIssues
  } else {
    core.info(
      `Found ${newSubIssues.length} sub issues for issue ID: ${issueId}`
    )
    for (const subIssue of newSubIssues) {
      if (!subIssues.find((issue) => issue === subIssue.id)) {
        subIssues.push(subIssue.id)
        if (subIssue.subIssues?.totalCount > 0) {
          core.info(
            `Sub issue ${subIssue.title} (${subIssue.id}) has sub issues, fetching them recursively...`
          )
          subIssues = await queryForSubIssues({
            inputGithubToken,
            issueId: subIssue.id,
            subIssues
          })
        }
      }
    }
  }
  return subIssues
}

export const getSubIssues = async ({
  inputGithubToken,
  issueId,
  dataCacheDir,
  devCache = false
}: {
  inputGithubToken: string
  issueId: string
  dataCacheDir: string
  devCache?: boolean
}): Promise<string[]> => {
  core.info(`Fetching all sub issues of issueID: ${issueId}`)

  let subIssues: string[] = []

  const cache = new FlatCache({
    cacheId: 'cache',
    cacheDir: dataCacheDir,
    ttl: 60 * 60 * 1000
  })
  await cache.load()
  const cacheData: string[] = await cache.getKey(`subissues_${issueId}`)

  if (devCache === true && cacheData !== undefined) {
    core.info(`Sub Issues were found in cache. Using cached data...`)
    subIssues = cacheData
  } else {
    core.info(
      `No existing cache found for sub issues, or caching disabled, fetching from GitHub...`
    )
    subIssues = await queryForSubIssues({
      inputGithubToken,
      issueId,
      subIssues
    })
  }

  await cache.setKey(`subissues_${issueId}`, subIssues)
  await cache.save()

  return subIssues
}

export default getSubIssues
