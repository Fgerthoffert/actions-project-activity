/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */
import * as core from '@actions/core'
import { Octokit } from '@octokit/core'

import { GitHubProject } from '../types/index.js'

import {
  getProjectGraphQL,
  ProjectResponse
} from './graphql/getProject.graphql.js'

export const getProject = async ({
  octokit,
  ownerLogin,
  projectNumber
}: {
  octokit: Octokit
  ownerLogin: string
  projectNumber: number
}): Promise<GitHubProject> => {
  core.info(
    `Fetching details about a project number ${projectNumber} in organization ${ownerLogin}`
  )

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
