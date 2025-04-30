/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */
import * as core from '@actions/core'

import { getProjectGraphQL } from './graphql/getProjectGraphQL'

export const getProject = async ({
  octokit,
  ownerLogin,
  projectNumber
}: {
  octokit: any
  ownerLogin: string
  projectNumber: number
}): Promise<GitHubProject> => {
  core.info(
    `Fetching details about a project number ${projectNumber} in organization ${ownerLogin}`
  )

  const graphQLResponse: any = await octokit
    .graphql(getProjectGraphQL, {
      ownerLogin: ownerLogin,
      projectNumber: projectNumber
    })
    .catch((error: Error) => {
      core.error(error.message)
    })
  return graphQLResponse?.organization?.projectV2
}

export default getProject
