import * as core from '@actions/core'

import {
  Config,
  GitHubProjectCard,
  GitHubProject,
  DeliveryItem
} from '../types/index.js'

import { getCacheDirectory } from './getCacheDirectory.js'
import { getProjectCards } from './getProjectCards.js'
import { getIssues } from './getIssues.js'
import { getPullRequests } from './getPullRequests.js'
import { getInitiatives } from './getInitiatives.js'
import getTimelineItems from './getTimelineItems.js'

export const fetchData = async ({
  inputGithubToken,
  inputDevCache,
  config,
  githubProject
}: {
  inputGithubToken: string
  inputDevCache: boolean
  config: Config
  githubProject: GitHubProject
}): Promise<DeliveryItem[]> => {
  core.info(`Fetching all data from GitHub`)

  const dataCacheDir = await getCacheDirectory('actions-project-activity')

  const githubProjectCards = await core.group(
    `⬇️ Fetching Project data from GitHub`,
    async () => {
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

  // Fetching initiatives listed in the config
  const issuesWithInitiatives = await getInitiatives({
    inputGithubToken,
    inputDevCache,
    config
  })

  let githubIssues = await core.group(
    `⬇️ Fetching Issues from GitHub`,
    async () => {
      const githubIssues = await getIssues({
        inputGithubToken,
        config,
        githubProjectCards,
        issuesWithInitiatives,
        dataCacheDir,
        devCache: inputDevCache
      })
      core.info(`Successfully retrieved ${githubIssues.length} Issues`)
      return githubIssues
    }
  )

  // if configured, attempt to retrieve timeline items for all GitHub issues
  if (config.timeline && config.timeline.enabled === true) {
    core.info(`Fetching timeline items for all issues`)
    githubIssues = await core.group(
      `⬇️ Fetching Timeline items from ${config.timeline.remote.baseUrl}`,
      async () => {
        const timelineItems = await getTimelineItems({
          config,
          deliveryItems: githubIssues,
          dataCacheDir,
          devCache: inputDevCache
        })
        core.info(`Successfully retrieved ${githubIssues.length} Issues`)
        return timelineItems
      }
    )
  }

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
