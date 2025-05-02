import * as core from '@actions/core'
import fs from 'fs'
import YAML from 'yaml'

import { Config } from '../types/index.js'

// Loads a config YAML file from the provided path
export const loadActionConfig = async (
  inputYamlConfig: string
): Promise<Config> => {
  const file = fs.readFileSync(inputYamlConfig, 'utf8')
  const config = YAML.parse(file)
  core.info(`Loaded action config file at: ${inputYamlConfig}`)
  core.debug('JSON representation of the YAML config:')
  core.debug(JSON.stringify(config))
  return config
}
