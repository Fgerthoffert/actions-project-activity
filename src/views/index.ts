import * as core from '@actions/core'
import path from 'path'

import { MetricGroup } from '../types/index.js'

import { getOutputDirectory } from './getOutputDirectory.js'
import { writeHTMLTemplate } from './writeHTMLTemplate.js'

import { tpl as dashboardTemplate } from './compiled-templates/group-view.html.base64.js'
import { tpl as indexTemplate } from './compiled-templates/index.html.base64.js'
import dashboardTpl from './test.html'

export const buildViews = async ({
  inputViewsOutputPath,
  groups
}: {
  inputViewsOutputPath: string
  groups: MetricGroup[]
}): Promise<null> => {
  const outputDir = await getOutputDirectory(inputViewsOutputPath)

  console.log(dashboardTpl)

  const indexRows = []
  for (const group of groups) {
    core.info(`Building view for group ${group.name}`)
    const base64String = await Buffer.from(JSON.stringify(group)).toString(
      'base64'
    )
    // The template is stored in base64 format, so we need to decode it
    const decodedDashboardTemplate = Buffer.from(
      dashboardTemplate,
      'base64'
    ).toString('utf8')
    const updatedHtmlTemplate = decodedDashboardTemplate.replace(
      'REPLACE_ME',
      base64String
    )
    await writeHTMLTemplate(
      path.join(outputDir, `${group.id}.html`),
      updatedHtmlTemplate
    )
    indexRows.push({
      name: group.name,
      description: group.description,
      link: `${group.id}.html`
    })
  }

  // Create an index.html file listing all dashboards
  const base64StringIndex = await Buffer.from(
    JSON.stringify(indexRows)
  ).toString('base64')

  // The template is stored in base64 format, so we need to decode it
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
