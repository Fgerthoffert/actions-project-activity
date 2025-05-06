import { augmentNodes } from '../src/data/augmentNodes'

import { gitHubTestIssues } from './githubIssues.data.js'
import { gitHubTestPullRequests } from './githubPullRequests.data.js'
import { gitHubTestProjectCards } from './githubProjectCards.data.js'

describe('augmentNodes', () => {
  it('should align mergedAt date to closedAt for pull requests', () => {
    const pointsField = 'Points'

    const result = augmentNodes(
      gitHubTestPullRequests,
      gitHubTestProjectCards,
      pointsField
    )

    expect(result[0].closedAt).toBe('2023-01-01')
  })

  it('should augment nodes with project fields and points', () => {
    const pointsField = 'Points'

    const result = augmentNodes(
      gitHubTestIssues,
      gitHubTestProjectCards,
      pointsField
    )

    expect(result[0].project?.Priority).toBe('High')
    expect(result[0].points).toBe(5)
    expect(result[0].labels).toEqual(['bug'])
    expect(result[0].projectsV2).toEqual(['Project 1'])
  })

  it('should return nodes unchanged if no matching project card is found', () => {
    const pointsField = 'Points'

    const result = augmentNodes(
      gitHubTestIssues,
      gitHubTestProjectCards,
      pointsField
    )

    expect(result[0]).toEqual(gitHubTestIssues[0])
  })

  it('should handle nodes with empty or undefined project fields gracefully', () => {
    const pointsField = 'Points'

    const result = augmentNodes(
      gitHubTestIssues,
      gitHubTestProjectCards,
      pointsField
    )

    expect(result[0].project).toEqual({})
    expect(result[0].points).toBe(0)
  })
})
