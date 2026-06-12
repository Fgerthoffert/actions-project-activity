import { augmentNodes } from '../src/data/augmentNodes'

import { gitHubTestIssues } from './githubIssues.data.js'
import { gitHubTestPullRequests } from './githubPullRequests.data.js'
import { gitHubTestProjectCards } from './githubProjectCards.data.js'

describe('augmentNodes', () => {
  it('should align mergedAt date to closedAt for pull requests', () => {
    const pointsField = 'Story Points'

    const result = augmentNodes({
      nodes: gitHubTestPullRequests,
      githubProjectCards: gitHubTestProjectCards,
      pointsField
    })

    // PR_1 has mergedAt = '2025-04-18T14:57:10Z', so closedAt should be aligned
    expect(result[0].closedAt).toBe('2025-04-18T14:57:10Z')
  })

  it('should augment nodes with project fields and points', () => {
    const pointsField = 'Story Points'

    const result = augmentNodes({
      nodes: gitHubTestPullRequests,
      githubProjectCards: gitHubTestProjectCards,
      pointsField
    })

    // PR_1 matches PROJECT_CARD_6 which has Story Points = 2
    expect(result[0].project?.Priority).toBe('Now')
    expect(result[0].points).toBe(2)
    expect(result[0].labels).toEqual(['Area:Tech'])
    expect(result[0].projectsV2).toEqual(['Team A'])
  })

  it('should return nodes with empty project when no matching card is found', () => {
    const pointsField = 'Story Points'

    const result = augmentNodes({
      nodes: gitHubTestIssues,
      githubProjectCards: [],
      pointsField
    })

    expect(result[0].project).toEqual({})
    expect(result[0].points).toBeNull()
  })

  it('should handle nodes with project fields but no points field', () => {
    const pointsField = 'Points'

    const result = augmentNodes({
      nodes: gitHubTestIssues,
      githubProjectCards: gitHubTestProjectCards,
      pointsField
    })

    // I_1 matches PROJECT_CARD_1 which has Priority='High' but no 'Points' field
    expect(result[0].project?.Priority).toBe('High')
    expect(result[0].points).toBeNull()
    expect(result[0].labels).toEqual([])
    expect(result[0].projectsV2).toEqual(['Project 1'])
  })
})
