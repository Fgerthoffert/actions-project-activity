import * as fs from 'fs'
import * as core from '@actions/core'

/**
 * Ensures that the specified folder exists, creating it if necessary, and returns its path.
 *
 * @param folderName - The name of the folder to check or create.
 * @returns A promise that resolves to the path of the folder.
 *
 * @remarks
 * - If the folder does not exist, it will be created recursively.
 * - Logs the folder name to the console and outputs an informational message using `core.info`.
 *
 * @example
 * ```typescript
 * const outputDir = await getOutputDirectory('output');
 * console.log(`Directory created or verified: ${outputDir}`);
 * ```
 */
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
