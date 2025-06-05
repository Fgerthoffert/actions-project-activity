import * as core from '@actions/core'
import path from 'path'

import { MetricGroup, GitHubProject, TimelineGroup } from '../types/index.js'

import { getOutputDirectory } from './getOutputDirectory.js'
import { writeHTMLTemplate } from './writeHTMLTemplate.js'

import { getId } from '../utils/getId.js'

import { tpl as dashboardTemplate } from './compiled-templates/group-view.html.base64.js'
import { tpl as timelineTemplate } from './compiled-templates/timeline-view.html.base64.js'
import { tpl as indexTemplate } from './compiled-templates/index.html.base64.js'

export const buildViews = async ({
  inputViewsOutputPath,
  githubProject,
  groups,
  timeline
}: {
  inputViewsOutputPath: string
  githubProject: GitHubProject
  groups: MetricGroup[]
  timeline: TimelineGroup[]
}): Promise<null> => {
  const outputDir = await getOutputDirectory(inputViewsOutputPath)

  const indexRows = []
  for (const group of groups) {
    core.info(`Building view for group ${group.name}`)
    const htmlFileName = `${getId(`${group.category === undefined ? '' : group.category}${group.id}`)}.html`
    const base64String = await Buffer.from(JSON.stringify(group)).toString(
      'base64'
    )

    const decodedDashboardTemplate = Buffer.from(
      dashboardTemplate,
      'base64'
    ).toString('utf8')
    const updatedHtmlTemplate = decodedDashboardTemplate.replace(
      'REPLACE_ME',
      base64String
    )
    await writeHTMLTemplate(
      path.join(outputDir, htmlFileName),
      updatedHtmlTemplate
    )
    indexRows.push({
      name: group.name,
      type: 'Velocity',
      description: group.description,
      category: group.category,
      link: htmlFileName
    })
  }

  for (const group of timeline) {
    core.info(`Building view for timeline group ${group.name}`)
    const htmlFileName = `timeline-${getId(`${group.category === undefined ? '' : group.category}${group.id}`)}.html`

    const base64String = await Buffer.from(JSON.stringify(group)).toString(
      'base64'
    )

    const decodedDashboardTemplate = Buffer.from(
      timelineTemplate,
      'base64'
    ).toString('utf8')
    const updatedHtmlTemplate = decodedDashboardTemplate.replace(
      'REPLACE_ME',
      base64String
    )
    await writeHTMLTemplate(
      path.join(outputDir, htmlFileName),
      updatedHtmlTemplate
    )

    indexRows.push({
      name: group.name,
      type: 'MTTR',
      description: group.description,
      category: group.category,
      link: htmlFileName
    })
  }

  // Create an index.html file listing all dashboards
  const base64StringIndex = await Buffer.from(
    JSON.stringify({
      ...githubProject,
      groups: indexRows
    })
  ).toString('base64')

  const decodedIndexTemplate = Buffer.from(indexTemplate, 'base64').toString(
    'utf8'
  )
  const updatedHtmlIndex = decodedIndexTemplate.replace(
    'REPLACE_ME',
    base64StringIndex
  )
  await writeHTMLTemplate(path.join(outputDir, 'index.html'), updatedHtmlIndex)

  return null
}

export default buildViews
