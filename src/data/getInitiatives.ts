import * as core from '@actions/core'

import {
  Config,
  GitHubIssue,
  DeliveryItemWithInitiative
} from '../types/index.js'
import { getIssue } from './getIssue.js'

import { getCacheDirectory } from './getCacheDirectory.js'
import { getSubIssues } from './getSubIssues.js'

export const getInitiatives = async ({
  inputGithubToken,
  inputDevCache,
  config
}: {
  inputGithubToken: string
  inputDevCache: boolean
  config: Config
}): Promise<DeliveryItemWithInitiative[]> => {
  core.info(`Fetching all data from GitHub`)

  const dataCacheDir = await getCacheDirectory('actions-project-activity')
  let allNodes: DeliveryItemWithInitiative[] = []

  if (config.initiatives === undefined) {
    core.info(`No initiatives configured, skipping fetching initiatives`)
    return allNodes
  }

  for (const initiative of config.initiatives) {
    const initiativeNodes = await core.group(
      `⬇️ Fetching data about initiative #${initiative.issueNumber} from ${initiative.repository}`,
      async () => {
        // Check that the initiative exists
        const [ownerLogin, repositoryName] = initiative.repository.split('/')

        const githubInitiativeIssue: GitHubIssue = await getIssue({
          inputGithubToken,
          ownerLogin: ownerLogin,
          repositoryName: repositoryName,
          issueNumber: initiative.issueNumber
        })

        core.info(
          `Initiative ${initiative.name} tied to GitHub issue: ${githubInitiativeIssue.title} (${githubInitiativeIssue.url})`
        )
        core.info(
          `Total direct sub issues: ${githubInitiativeIssue.subIssues?.totalCount ?? 0} - will look recursively for sub issues...`
        )

        const subIssues: string[] = await getSubIssues({
          inputGithubToken,
          issueId: githubInitiativeIssue.id,
          dataCacheDir,
          devCache: inputDevCache
        })

        core.info(
          `Total sub issues (including recursively): ${subIssues.length ?? 0}`
        )

        return subIssues.map((issueId) => {
          return {
            id: issueId,
            initiative: {
              id: githubInitiativeIssue.id,
              name: initiative.name,
              title: githubInitiativeIssue.title,
              url: githubInitiativeIssue.url
            }
          }
        })
      }
    )
    core.info(
      `Initiative #${initiative.issueNumber} fetched with ${initiativeNodes.length} nodes`
    )
    // Add the initiative nodes to the allNodes array
    allNodes = [...allNodes, ...initiativeNodes]
  }

  return allNodes
}

export default getInitiatives
