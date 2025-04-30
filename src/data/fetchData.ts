/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */

import * as core from '@actions/core'
import { FlatCache } from 'flat-cache'

import {
  getCacheDirectory,
  getProject,
  getProjectCards,
  getIssues,
  getPullRequests
} from './'

export const fetchData = async ({
  octokit,
  inputGithubToken,
  inputGithubOrgName,
  inputGithubProjectNumber,
  inputDevCache,
  config
}: {
  octokit: any
  inputGithubToken: string
  inputGithubOrgName: string
  inputGithubProjectNumber: string
  inputDevCache: boolean
  config: any
}): Promise<any> => {
  core.info(`Fetching all data from GitHub`)

  const dataCacheDir = await getCacheDirectory('actions-project-activity')

  const githubProject: GitHubProject = await getProject({
    octokit,
    ownerLogin: inputGithubOrgName,
    projectNumber: inputGithubProjectNumber
  })
  core.info(
    `Successfully retrieved project: ${githubProject.title} (ID: ${githubProject.id}) - Total number of cards: ${githubProject.items.totalCount}`
  )

  const githubProjectCards: any = await getProjectCards({
    inputGithubToken,
    projectId: githubProject.id,
    dataCacheDir,
    devCache: inputDevCache
  })

  const githubIssues = await getIssues({
    octokit,
    config,
    githubProjectCards,
    dataCacheDir,
    devCache: inputDevCache
  })
  core.info(`Successfully retrieved ${githubIssues.length} Issues`)

  const githubPullRequests = await getPullRequests({
    octokit,
    config,
    githubProjectCards,
    dataCacheDir,
    devCache: inputDevCache
  })
  core.info(`Successfully retrieved ${githubPullRequests.length} PRs`)

  const allNodes = [...githubIssues, ...githubPullRequests]

  return allNodes
}

export default fetchData
