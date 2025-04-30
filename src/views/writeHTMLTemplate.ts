import * as core from '@actions/core'
import fs from 'fs'

export const writeHTMLTemplate = async (
  viewPath: string,
  viewContent: string
): Promise<any> => {
  const view = fs.writeFileSync(viewPath, viewContent, {
    encoding: 'utf8',
    flag: 'w' // 'w' = write (overwrites file if it exists)
  })
  core.info(`Wrote view into: ${viewPath}`)
  return view
}
