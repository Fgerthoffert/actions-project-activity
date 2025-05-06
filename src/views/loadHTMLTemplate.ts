import * as core from '@actions/core'
import fs from 'fs'

/**
 * Loads an HTML template from the specified file path and returns its content as a string.
 *
 * @param templatePath - The file path to the HTML template to be loaded.
 * @returns A promise that resolves to the content of the HTML template as a string.
 *
 * @throws Will throw an error if the file cannot be read.
 */
export const loadHTMLTemplate = async (
  templatePath: string
): Promise<string> => {
  const templateContent = fs.readFileSync(templatePath, 'utf8')
  core.info(`Loaded HTML template file: ${templatePath}`)
  return templateContent
}
