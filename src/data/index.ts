import * as core from '@actions/core'

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
  inputGithubToken,
  inputGithubOrgName,
  inputGithubProjectNumber,
  inputDevCache,
  config
}: {
  inputGithubToken: string
  inputGithubOrgName: string
  inputGithubProjectNumber: number
  inputDevCache: boolean
  config: Config
}): Promise<DeliveryItem[]> => {
  core.info(`Fetching all data from GitHub`)

  const dataCacheDir = await getCacheDirectory('actions-project-activity')

  const githubProjectCards = await core.group(
    `⬇️ Fetching Project data from GitHub`,
    async () => {
      const githubProject: GitHubProject = await getProject({
        inputGithubToken,
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
      return githubProjectCards
    }
  )

  const githubIssues = await core.group(
    `⬇️ Fetching Issues from GitHub`,
    async () => {
      const githubIssues = await getIssues({
        inputGithubToken,
        config,
        githubProjectCards,
        dataCacheDir,
        devCache: inputDevCache
      })
      core.info(`Successfully retrieved ${githubIssues.length} Issues`)
      return githubIssues
    }
  )

  const githubPullRequests = await core.group(
    `⬇️ Fetching Pull Requests from GitHub`,
    async () => {
      const githubPullRequests = await getPullRequests({
        inputGithubToken,
        config,
        githubProjectCards,
        dataCacheDir,
        devCache: inputDevCache
      })
      core.info(`Successfully retrieved ${githubPullRequests.length} PRs`)
      return githubPullRequests
    }
  )

  const allNodes: DeliveryItem[] = [...githubIssues, ...githubPullRequests]

  return allNodes
}

export default fetchData
