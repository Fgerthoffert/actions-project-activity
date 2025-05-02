import * as core from '@actions/core'
import * as github from '@actions/github'

import { GitHubProject } from '../types/index.js'

import {
  getProjectGraphQL,
  ProjectResponse
} from './graphql/getProject.graphql.js'

export const getProject = async ({
  inputGithubToken,
  ownerLogin,
  projectNumber
}: {
  inputGithubToken: string
  ownerLogin: string
  projectNumber: number
}): Promise<GitHubProject> => {
  core.info(
    `Fetching details about a project number ${projectNumber} in organization ${ownerLogin}`
  )

  const octokit = github.getOctokit(inputGithubToken)

  const graphQLResponse = await octokit
    .graphql<ProjectResponse>(getProjectGraphQL, {
      ownerLogin: ownerLogin,
      projectNumber: projectNumber
    })
    .catch((error: Error) => {
      core.error(error.message)
      return null
    })
  if (!graphQLResponse?.organization?.projectV2) {
    throw new Error('Project not found or response is invalid')
  }
  return graphQLResponse.organization.projectV2
}

export default getProject
