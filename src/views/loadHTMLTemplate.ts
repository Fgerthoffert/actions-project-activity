import * as core from '@actions/core'
import fs from 'fs'

export const loadHTMLTemplate = async (templatePath: string): Promise<any> => {
  const templateContent = fs.readFileSync(templatePath, 'utf8')
  core.info(`Loaded HTML template file: ${templatePath}`)
  return templateContent
}
