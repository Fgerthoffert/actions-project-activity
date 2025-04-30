/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */
import * as fs from 'fs'

import * as core from '@actions/core'

export const getOutputDirectory = async (
  folderName: string
): Promise<string> => {
  console.log(folderName)
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true })
  }
  core.info(`Output directory available at: ${folderName}`)
  return folderName
}

export default getOutputDirectory
