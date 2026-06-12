import { getId } from '../src/utils/getId'

describe('getId', () => {
  it('should convert a string to lowercase and strip non-alphanumeric characters', () => {
    expect(getId('Hello World')).toBe('helloworld')
  })

  it('should handle strings with special characters', () => {
    expect(getId('foo-bar_baz!@#$%')).toBe('foobarbaz')
  })

  it('should handle strings with numbers', () => {
    expect(getId('Test 123')).toBe('test123')
  })

  it('should return an empty string for a string with only special characters', () => {
    expect(getId('!@#$%^&*()')).toBe('')
  })

  it('should handle already lowercase alphanumeric strings', () => {
    expect(getId('alreadyclean')).toBe('alreadyclean')
  })

  it('should handle mixed case with numbers and special chars', () => {
    expect(getId('My Project V2 - Sprint #3')).toBe('myprojectv2sprint3')
  })

  it('should handle an empty string', () => {
    expect(getId('')).toBe('')
  })

  it('should preserve the plus sign as it matches [a-z0-9+]', () => {
    expect(getId('C++')).toBe('c++')
  })
})
