import * as core from '@actions/core'
import * as github from '@actions/github'

import { GitHubIssue } from '../types/index.js'

import { getIssueGraphQL, IssueResponse } from './graphql/getIssue.graphql.js'

export const getIssue = async ({
  inputGithubToken,
  ownerLogin,
  repositoryName,
  issueNumber
}: {
  inputGithubToken: string
  ownerLogin: string
  repositoryName: string
  issueNumber: number
}): Promise<GitHubIssue> => {
  core.info(
    `Fetching details about a issue number ${issueNumber} in ${ownerLogin}/${repositoryName}`
  )

  const octokit = github.getOctokit(inputGithubToken)

  const graphQLResponse = await octokit
    .graphql<IssueResponse>(getIssueGraphQL, {
      ownerLogin: ownerLogin,
      repositoryName: repositoryName,
      issueNumber: issueNumber
    })
    .catch((error: Error) => {
      core.error(error.message)
      return null
    })
  if (!graphQLResponse?.repository?.issue) {
    throw new Error('Issue not found or response is invalid')
  }
  return graphQLResponse.repository.issue
}

export default getIssue
