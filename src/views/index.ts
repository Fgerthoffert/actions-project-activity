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

  const HtmlTemplate = await loadHTMLTemplate(
    '/Users/fgerthoffert/GitHub/fgerthoffert/actions-project-activity/dashboard-template/index.html'
  )

  for (const group of groups) {
    core.info(`Building view for group ${group.name}`)
    const base64String = await Buffer.from(JSON.stringify(group)).toString(
      'base64'
    )
    const updatedHtmlTemplate = HtmlTemplate.replace('REPLACE_ME', base64String)
    await writeHTMLTemplate(
      path.join(outputDir, `${group.id}.html`),
      updatedHtmlTemplate
    )
  }
  return null
}

export default buildViews
