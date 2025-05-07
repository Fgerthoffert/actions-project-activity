import * as core from '@actions/core'
import fs from 'fs'
import YAML from 'yaml'

import { Config, ConfigGroup, ConfigTemplate } from '../types/index.js'

/**
 * Formats a given date object into a string in the format "YYYY-MM-DD".
 *
 * @param date - The date to format. It is expected to be a valid Date object.
 * @returns A string representing the formatted date in "YYYY-MM-DD" format.
 */
const formatDate = (date: any) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Replaces GitHub-style date expressions in a configuration string with actual dates.
 *
 * The function identifies date expressions in the format `@today-[number][unit]`, where:
 * - `[number]` is a positive integer.
 * - `[unit]` is one of the following:
 *   - `d` for days
 *   - `w` for weeks
 *   - `m` for months
 *   - `y` for years
 *
 * For example:
 * - `@today-5d` will be replaced with the date 5 days before the `baseDate`.
 * - `@today-2w` will be replaced with the date 2 weeks before the `baseDate`.
 *
 * @param configString - The input string containing GitHub-style date expressions.
 * @param baseDate - The base date to calculate relative dates from. Defaults to the current date.
 * @returns A new string with the date expressions replaced by formatted dates in `YYYY-MM-DD` format.
 */
const replaceDatesInConfig = (configString: string, baseDate = new Date()) => {
  // Regex to match GitHub-style date expressions
  // @today-[number][unit] where unit is d, w, m, or y
  const dateExprRegex = /@today-(\d+)([dwmy])/gi

  return configString.replace(
    dateExprRegex,
    (match: any, value: any, unit: any) => {
      const numValue = parseInt(value, 10)
      const date = new Date(baseDate)

      switch (unit.toLowerCase()) {
        case 'd':
          date.setDate(date.getDate() - numValue)
          break
        case 'w':
          date.setDate(date.getDate() - numValue * 7)
          break
        case 'm':
          date.setMonth(date.getMonth() - numValue)
          break
        case 'y':
          date.setFullYear(date.getFullYear() - numValue)
          break
        default:
          return match // Return original if unit not recognized
      }

      // Format the date as YYYY-MM-DD
      return formatDate(date)
    }
  )
}

// Loads a config YAML file from the provided path
/**
 * Loads and processes an action configuration file in YAML format.
 *
 * This function reads the specified YAML configuration file, replaces any date placeholders
 * within the file, parses the YAML content into a JavaScript object, and processes any
 * stream templates defined in the configuration. The resulting configuration object is
 * returned with all templates resolved.
 *
 * @param inputYamlConfig - The file path to the YAML configuration file to be loaded.
 * @returns A promise that resolves to the processed configuration object.
 *
 * The returned configuration object includes:
 * - All properties from the original YAML configuration.
 * - Groups with their streams resolved, replacing any streams defined by a template.
 *
 * @throws Will throw an error if the file cannot be read or if the YAML parsing fails.
 */
export const loadActionConfig = async (
  inputYamlConfig: string
): Promise<Config> => {
  let file = fs.readFileSync(inputYamlConfig, 'utf8')
  file = replaceDatesInConfig(file)

  const config = YAML.parse(file)
  core.info(`Loaded action config file at: ${inputYamlConfig}`)
  core.debug('JSON representation of the YAML config:')
  core.debug(JSON.stringify(config))

  // The template itself might contain templates, which are useful to simplify the configuration

  return {
    ...config,
    groups: config.groups.map((group: ConfigGroup) => {
      let streams = group.streams
      if (group.streamsTemplate !== undefined) {
        // If a template is defined, we need to find the corresponding template
        // and replace the streams with the template
        const streamTemplate = config.templates.find(
          (template: ConfigTemplate) => template.name === group.streamsTemplate
        )
        if (streamTemplate !== undefined) {
          streams = streamTemplate.streams
        }
      }
      return {
        ...group,
        streams: streams
      }
    })
  }
}
