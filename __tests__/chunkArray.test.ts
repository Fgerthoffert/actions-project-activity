import { chunkArray } from '../src/utils/chunkArray'

describe('chunkArray', () => {
  it('should split an array into chunks of the specified size', () => {
    const data = [1, 2, 3, 4, 5]
    const chunkSize = 2
    const result = chunkArray(data, chunkSize)
    expect(result).toEqual([[1, 2], [3, 4], [5]])
  })

  it('should return an empty array when the input array is empty', () => {
    const data: number[] = []
    const chunkSize = 3
    const result = chunkArray(data, chunkSize)
    expect(result).toEqual([])
  })

  it('should handle chunk size larger than the array length', () => {
    const data = [1, 2, 3]
    const chunkSize = 5
    const result = chunkArray(data, chunkSize)
    expect(result).toEqual([[1, 2, 3]])
  })

  it('should throw an error if chunk size is not a positive integer', () => {
    const data = [1, 2, 3, 4]
    expect(() => chunkArray(data, 0)).toThrow()
    expect(() => chunkArray(data, -1)).toThrow()
  })

  it('should handle arrays with non-numeric elements', () => {
    const data = ['a', 'b', 'c', 'd']
    const chunkSize = 2
    const result = chunkArray(data, chunkSize)
    expect(result).toEqual([
      ['a', 'b'],
      ['c', 'd']
    ])
  })
})
