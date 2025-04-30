/* eslint-disable  @typescript-eslint/no-unsafe-member-access */
/* eslint-disable  @typescript-eslint/no-unsafe-assignment */
/* eslint-disable  @typescript-eslint/no-explicit-any */
/* eslint-disable  @typescript-eslint/no-unsafe-call */
import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'

import * as core from '@actions/core'

export const getCacheDirectory = async (
  folderName: string
): Promise<string> => {
  const dataCacheDir = path.join(os.tmpdir(), folderName)
  if (!fs.existsSync(dataCacheDir)) {
    fs.mkdirSync(dataCacheDir, { recursive: true })
  }
  core.info(`Cache directory created at: ${dataCacheDir}`)
  return dataCacheDir
}

export default getCacheDirectory
