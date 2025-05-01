/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */

import * as core from '@actions/core'
import { Octokit } from '@octokit/core'

import {
  Config,
  GitHubProjectCard,
  GitHubProject,
  DeliveryItem
} from '../types/index.js'

import { getCacheDirectory } from './getCacheDirectory.js'
import { getProject } from './getProject.js'
import { getProjectCards } from './getProjectCards.js'
import { getIssues } from './getIssues.js'
import { getPullRequests } from './getPullRequests.js'

export const fetchData = async ({
  octokit,
  inputGithubToken,
  inputGithubOrgName,
  inputGithubProjectNumber,
  inputDevCache,
  config
}: {
  octokit: Octokit
  inputGithubToken: string
  inputGithubOrgName: string
  inputGithubProjectNumber: number
  inputDevCache: boolean
  config: Config
}): Promise<DeliveryItem[]> => {
  core.info(`Fetching all data from GitHub`)

  const dataCacheDir = await getCacheDirectory('actions-project-activity')

  const githubProject: GitHubProject = await getProject({
    octokit,
    ownerLogin: inputGithubOrgName,
    projectNumber: inputGithubProjectNumber
  })
  core.info(
    `Successfully retrieved project: ${githubProject.title} (ID: ${githubProject.id}) - Total number of cards: ${githubProject.items?.totalCount ?? 0}`
  )

  const githubProjectCards: GitHubProjectCard[] = await getProjectCards({
    inputGithubToken,
    projectId: githubProject.id!,
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

  const allNodes: DeliveryItem[] = [...githubIssues, ...githubPullRequests]

  return allNodes
}

export default fetchData
