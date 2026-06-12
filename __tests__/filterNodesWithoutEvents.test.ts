import { jest } from '@jest/globals'

jest.unstable_mockModule('@actions/core', () => ({
  info: jest.fn()
}))

const { filterNodesWithoutEvents } = await import(
  '../src/timelineMetrics/filterNodesWithoutEvents.js'
)
import { DeliveryItem } from '../src/types/index.js'

const makeNode = (overrides: Partial<DeliveryItem>): DeliveryItem => ({
  id: '1',
  labels: [],
  mergedAt: null,
  milestone: null,
  initiative: null,
  closedAt: null,
  number: 1,
  points: null,
  project: {},
  projectsV2: [],
  url: '',
  title: 'Test node',
  repository: { name: 'repo', url: 'https://github.com/repo', owner: { login: 'owner' } },
  type: 'issue',
  ...overrides
})

describe('filterNodesWithoutEvents', () => {
  it('should return only nodes that have timeline events', () => {
    const nodes: DeliveryItem[] = [
      makeNode({
        id: '1',
        timeline: {
          id: 'tl-1',
          events: [{ id: 'e1', action: 'edited', date: '2023-10-01T00:00:00Z' }]
        }
      }),
      makeNode({
        id: '2',
        timeline: { id: 'tl-2', events: [] }
      }),
      makeNode({ id: '3' }) // no timeline at all
    ]

    const result = filterNodesWithoutEvents({ nodes })

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('1')
  })

  it('should return empty array when no nodes have events', () => {
    const nodes: DeliveryItem[] = [
      makeNode({ id: '1', timeline: { id: 'tl-1', events: [] } }),
      makeNode({ id: '2' })
    ]

    const result = filterNodesWithoutEvents({ nodes })

    expect(result).toHaveLength(0)
  })

  it('should return all nodes when all have timeline events', () => {
    const nodes: DeliveryItem[] = [
      makeNode({
        id: '1',
        timeline: {
          id: 'tl-1',
          events: [{ id: 'e1', action: 'edited', date: '2023-10-01T00:00:00Z' }]
        }
      }),
      makeNode({
        id: '2',
        timeline: {
          id: 'tl-2',
          events: [{ id: 'e2', action: 'edited', date: '2023-10-02T00:00:00Z' }]
        }
      })
    ]

    const result = filterNodesWithoutEvents({ nodes })

    expect(result).toHaveLength(2)
  })

  it('should return empty array for empty input', () => {
    const result = filterNodesWithoutEvents({ nodes: [] })

    expect(result).toHaveLength(0)
  })
})
