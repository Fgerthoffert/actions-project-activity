import * as core from '@actions/core'
import fs from 'fs'

/**
 * Writes the provided HTML content to a specified file path.
 *
 * @param viewPath - The file path where the HTML content should be written.
 * @param viewContent - The HTML content to be written to the file.
 * @returns A promise that resolves to `null` once the file has been written.
 *
 * @remarks
 * This function uses `fs.writeFileSync` to write the content to the file.
 * The file is overwritten if it already exists.
 * Logs the file path to the console upon successful write operation.
 *
 * @example
 * ```typescript
 * await writeHTMLTemplate('/path/to/file.html', '<h1>Hello, World!</h1>');
 * ```
 */
export const writeHTMLTemplate = async (
  viewPath: string,
  viewContent: string
): Promise<null> => {
  fs.writeFileSync(viewPath, viewContent, {
    encoding: 'utf8',
    flag: 'w' // 'w' = write (overwrites file if it exists)
  })
  core.info(`Wrote view into: ${viewPath}`)
  return null
}
