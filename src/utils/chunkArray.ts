//https://ourcodeworld.com/articles/read/278/how-to-split-an-array-into-chunks-of-the-same-size-easily-in-javascript
/**
 * Splits an array into smaller chunks of a specified size.
 *
 * @template T - The type of elements in the array.
 * @param srcArray - The source array to be divided into chunks.
 * @param chunkSize - The size of each chunk. Must be a positive integer.
 * @returns An array of arrays, where each inner array is a chunk of the original array.
 *
 * @example
 * ```typescript
 * const data = [1, 2, 3, 4, 5];
 * const chunks = chunkArray(data, 2);
 * console.log(chunks); // Output: [[1, 2], [3, 4], [5]]
 * ```
 */
export const chunkArray = <T>(srcArray: T[], chunkSize: number): T[][] => {
  let idx = 0
  const tmpArray: T[][] = []
  for (idx = 0; idx < srcArray.length; idx += chunkSize) {
    tmpArray.push(srcArray.slice(idx, idx + chunkSize))
  }
  return tmpArray
}

export default chunkArray
