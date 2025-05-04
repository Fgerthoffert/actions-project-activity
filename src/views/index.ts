import * as core from '@actions/core'
import path from 'path'

import { MetricGroup } from '../types/index.js'

import { getOutputDirectory } from './getOutputDirectory.js'
import { loadHTMLTemplate } from './loadHTMLTemplate.js'
import { writeHTMLTemplate } from './writeHTMLTemplate.js'

export const buildViews = async ({
  inputViewsOutputPath,
  groups
}: {
  inputViewsOutputPath: string
  groups: MetricGroup[]
}): Promise<null> => {
  const outputDir = await getOutputDirectory(inputViewsOutputPath)

  const htmlTemplatesPath = path.join(process.cwd(), 'dist', 'templates')
  const htmlDashboardTemplate = path.join(htmlTemplatesPath, 'group-view.html')

  const htmlTemplate = await loadHTMLTemplate(htmlDashboardTemplate)

  const indexRows = []
  for (const group of groups) {
    core.info(`Building view for group ${group.name}`)
    const base64String = await Buffer.from(JSON.stringify(group)).toString(
      'base64'
    )
    const updatedHtmlTemplate = htmlTemplate.replace('REPLACE_ME', base64String)
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
  const htmlIndexTemplatePath = path.join(htmlTemplatesPath, 'index.html')
  const htmlIndex = await loadHTMLTemplate(htmlIndexTemplatePath)
  const base64StringIndex = await Buffer.from(
    JSON.stringify(indexRows)
  ).toString('base64')
  const updatedHtmlIndex = htmlIndex.replace('REPLACE_ME', base64StringIndex)
  await writeHTMLTemplate(path.join(outputDir, 'index.html'), updatedHtmlIndex)

  return null
}

export default buildViews
