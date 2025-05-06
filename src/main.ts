import * as core from '@actions/core'
import * as github from '@actions/github'

import { loadActionConfig } from './utils/index.js'
import { fetchData } from './data/index.js'
import { buildMetrics } from './metrics/index.js'
import { buildViews } from './views/index.js'

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const inputGithubToken = core.getInput('token')
    const inputYamlConfig = core.getInput('config')
    const inputGithubOrgName = core.getInput('github_org_name')
    const inputGithubProjectNumber = parseInt(
      core.getInput('github_project_number'),
      10
    )
    const inputDevCache = core.getInput('dev_cache') === 'true'
    const inputViewsOutputPath = core.getInput('views_output_path')
    const octokit = github.getOctokit(inputGithubToken)

    const config = await loadActionConfig(inputYamlConfig)

    const {
      data: { login }
    } = await octokit.rest.users.getAuthenticated()
    core.info(`Successfully authenticated to GitHub as: ${login}`)

    // Fetch all data from GitHub and return an array of nodes (both Issues and PRs)
    const allNodes = await fetchData({
      inputGithubToken,
      inputGithubOrgName,
      inputGithubProjectNumber,
      inputDevCache,
      config
    })

    // Create an array containing all metrics across all groups
    const allMetrics = await buildMetrics({
      nodes: allNodes,
      config
    })

    // Build the HTML views
    await buildViews({
      inputViewsOutputPath,
      groups: allMetrics
    })

    core.info(
      `Successfully built ${allMetrics.length} views and saved them to ${inputViewsOutputPath}`
    )
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
