/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */
import * as core from '@actions/core'
import path from 'path'

import { getOutputDirectory, loadHTMLTemplate, writeHTMLTemplate } from './'

export const buildViews = async ({
  inputViewsOutputPath,
  groups
}: {
  inputViewsOutputPath: string
  groups: any
}): Promise<any> => {
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
