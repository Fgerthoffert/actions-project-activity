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

  it('should take points from the issue field when present', () => {
    const pointsField = 'Story Points'

    const nodes = [
      {
        ...gitHubTestIssues[0],
        issueFieldValues: {
          nodes: [
            {
              __typename: 'IssueFieldNumberValue',
              value: 8,
              field: { name: 'Story Points' }
            }
          ]
        }
      }
    ]

    const result = augmentNodes({
      nodes,
      githubProjectCards: gitHubTestProjectCards,
      pointsField
    })

    expect(result[0].points).toBe(8)
  })

  it('should prefer the issue field over the project field for points', () => {
    const pointsField = 'Story Points'

    // PR_1 matches PROJECT_CARD_6 which has Story Points = 2 as a project field,
    // but here the node also carries an issue field with Story Points = 5
    const nodes = [
      {
        ...gitHubTestPullRequests[0],
        issueFieldValues: {
          nodes: [
            {
              __typename: 'IssueFieldNumberValue',
              value: 5,
              field: { name: 'Story Points' }
            }
          ]
        }
      }
    ]

    const result = augmentNodes({
      nodes,
      githubProjectCards: gitHubTestProjectCards,
      pointsField
    })

    expect(result[0].points).toBe(5)
  })

  it('should fall back to the project field when the issue field does not match', () => {
    const pointsField = 'Story Points'

    // The issue fields present are either not number fields (only __typename
    // is returned by GraphQL for non-number fields) or attached to a different
    // field name, points should come from the project field of PROJECT_CARD_6
    // (Story Points = 2)
    const nodes = [
      {
        ...gitHubTestPullRequests[0],
        issueFieldValues: {
          nodes: [
            {
              __typename: 'IssueFieldTextValue'
            },
            {
              __typename: 'IssueFieldNumberValue',
              value: 13,
              field: { name: 'Another Field' }
            }
          ]
        }
      }
    ]

    const result = augmentNodes({
      nodes,
      githubProjectCards: gitHubTestProjectCards,
      pointsField
    })

    expect(result[0].points).toBe(2)
  })
})
