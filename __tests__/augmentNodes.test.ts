import { augmentNodes } from '../src/data/augmentNodes'
import {
  GitHubProjectCard,
  GitHubPullRequest,
  GitHubIssue
} from '../src/types/index.js' // Adjust the path if necessary

describe('augmentNodes', () => {
  it('should align mergedAt date to closedAt for pull requests', () => {
    const nodes: GitHubPullRequest[] = [
      {
        id: '1',
        mergedAt: '2023-01-01',
        closedAt: null,
        updatedAt: '2023-01-01',
        number: 1,
        __typename: 'PullRequest',
        labels: { nodes: [] },
        projectsV2: { nodes: [] }
      }
    ]
    const githubProjectCards: GitHubProjectCard[] = []
    const pointsField = 'Points'

    const result = augmentNodes(nodes, githubProjectCards, pointsField)

    expect(result[0].closedAt).toBe('2023-01-01')
  })

  it('should augment nodes with project fields and points', () => {
    const nodes: GitHubIssue[] = [
      {
        id: '1',
        __typename: 'Issue',
        labels: { nodes: [{ name: 'bug' }] },
        projectsV2: {
          nodes: [{ id: 'project-1', title: 'Project 1' }]
        },
        updatedAt: '2023-01-01',
        number: 1,
        closedAt: null
      }
    ]
    const githubProjectCards: GitHubProjectCard[] = [
      {
        id: 'card-1',
        updatedAt: '2023-01-01',
        content: {
          id: '1',
          __typename: 'Issue',
          updatedAt: '2023-01-01',
          number: 1,
          closedAt: null,
          labels: { nodes: [] },
          projectsV2: { nodes: [] }
        },
        fieldValues: {
          nodes: [
            {
              field: { name: 'Priority' },
              __typename: 'ProjectV2ItemFieldTextValue',
              text: 'High'
            },
            {
              field: { name: 'Points' },
              __typename: 'ProjectV2ItemFieldNumberValue',
              number: 5
            }
          ]
        }
      }
    ]
    const pointsField = 'Points'

    const result = augmentNodes(nodes, githubProjectCards, pointsField)

    expect(result[0].project?.Priority).toBe('High')
    expect(result[0].points).toBe(5)
    expect(result[0].labels).toEqual(['bug'])
    expect(result[0].projectsV2).toEqual(['Project 1'])
  })

  it('should return nodes unchanged if no matching project card is found', () => {
    const nodes: GitHubIssue[] = [
      {
        id: '1',
        __typename: 'Issue',
        labels: { nodes: [] },
        projectsV2: { nodes: [] },
        updatedAt: '2023-01-01',
        number: 1,
        closedAt: null
      }
    ]
    const githubProjectCards: GitHubProjectCard[] = []
    const pointsField = 'Points'

    const result = augmentNodes(nodes, githubProjectCards, pointsField)

    expect(result[0]).toEqual(nodes[0])
  })

  it('should handle nodes with empty or undefined project fields gracefully', () => {
    const nodes: GitHubIssue[] = [
      {
        id: '1',
        __typename: 'Issue',
        labels: { nodes: [] },
        projectsV2: { nodes: [] },
        updatedAt: '2023-01-01',
        number: 1,
        closedAt: null
      }
    ]
    const githubProjectCards: GitHubProjectCard[] = [
      {
        id: 'card-1',
        updatedAt: '2023-01-01',
        content: {
          id: '1',
          __typename: 'Issue',
          labels: { nodes: [] },
          projectsV2: { nodes: [] },
          updatedAt: '2023-01-01',
          number: 1,
          closedAt: null
        },
        fieldValues: { nodes: [] }
      }
    ]
    const pointsField = 'Points'

    const result = augmentNodes(nodes, githubProjectCards, pointsField)

    expect(result[0].project).toEqual({})
    expect(result[0].points).toBe(0)
  })
})
