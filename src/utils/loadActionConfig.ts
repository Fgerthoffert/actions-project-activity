import * as core from '@actions/core'
import fs from 'fs'
import YAML from 'yaml'

import { Config, ConfigGroup, ConfigTemplate } from '../types/index.js'

// Loads a config YAML file from the provided path
export const loadActionConfig = async (
  inputYamlConfig: string
): Promise<Config> => {
  const file = fs.readFileSync(inputYamlConfig, 'utf8')
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
