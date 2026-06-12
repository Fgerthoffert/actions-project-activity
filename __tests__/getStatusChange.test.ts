import { jest } from '@jest/globals'

jest.unstable_mockModule('@actions/core', () => ({
  info: jest.fn()
}))

const { getStatusChange } = await import(
  '../src/timelineMetrics/getStatusChange.js'
)
import { DeliveryItem, ConfigTimelineGroup } from '../src/types/index.js'

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
  repository: {
    name: 'repo',
    url: 'https://github.com/repo',
    owner: { login: 'owner' }
  },
  type: 'issue',
  ...overrides
})

const makeGroup = (
  overrides: Partial<ConfigTimelineGroup> = {}
): ConfigTimelineGroup => ({
  name: 'Test Group',
  description: 'Test',
  field: 'Status',
  valueFrom: 'In Progress',
  valueTo: 'Done',
  query: {},
  ...overrides
})

describe('getStatusChange', () => {
  it('should find nodes with matching status change events', () => {
    const nodes: DeliveryItem[] = [
      makeNode({
        id: 'node-1',
        title: 'Node with transition',
        timeline: {
          id: 'tl-1',
          events: [
            {
              id: 'e1',
              action: 'edited',
              date: '2023-10-01T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Status',
                  from: { name: 'Todo' },
                  to: { name: 'In Progress' }
                }
              }
            },
            {
              id: 'e2',
              action: 'edited',
              date: '2023-10-05T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Status',
                  from: { name: 'In Progress' },
                  to: { name: 'Done' }
                }
              }
            }
          ]
        }
      })
    ]

    const group = makeGroup()
    const result = getStatusChange({ nodes, group })

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('node-1')
    expect(result[0].timelineMetrics).toBeDefined()
    expect(result[0].timelineMetrics!.valueFrom).toBe('In Progress')
    expect(result[0].timelineMetrics!.valueTo).toBe('Done')
  })

  it('should skip nodes without timeline', () => {
    const nodes: DeliveryItem[] = [
      makeNode({ id: 'node-1', title: 'No timeline' })
    ]

    const group = makeGroup()
    const result = getStatusChange({ nodes, group })

    expect(result).toHaveLength(0)
  })

  it('should skip nodes with empty timeline events', () => {
    const nodes: DeliveryItem[] = [
      makeNode({
        id: 'node-1',
        title: 'Empty events',
        timeline: { id: 'tl-1', events: [] }
      })
    ]

    const group = makeGroup()
    const result = getStatusChange({ nodes, group })

    expect(result).toHaveLength(0)
  })

  it('should skip nodes without matching start event', () => {
    const nodes: DeliveryItem[] = [
      makeNode({
        id: 'node-1',
        title: 'Wrong status',
        timeline: {
          id: 'tl-1',
          events: [
            {
              id: 'e1',
              action: 'edited',
              date: '2023-10-01T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Status',
                  from: { name: 'Todo' },
                  to: { name: 'Done' } // Skips "In Progress" entirely
                }
              }
            }
          ]
        }
      })
    ]

    const group = makeGroup()
    const result = getStatusChange({ nodes, group })

    expect(result).toHaveLength(0)
  })

  it('should calculate business days correctly (skipping weekends)', () => {
    // Oct 2 (Mon) to Oct 6 (Fri) = 5 business days
    const nodes: DeliveryItem[] = [
      makeNode({
        id: 'node-1',
        title: 'Weekday transition',
        timeline: {
          id: 'tl-1',
          events: [
            {
              id: 'e1',
              action: 'edited',
              date: '2023-10-02T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Status',
                  from: { name: 'Todo' },
                  to: { name: 'In Progress' }
                }
              }
            },
            {
              id: 'e2',
              action: 'edited',
              date: '2023-10-06T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Status',
                  from: { name: 'In Progress' },
                  to: { name: 'Done' }
                }
              }
            }
          ]
        }
      })
    ]

    const group = makeGroup()
    const result = getStatusChange({ nodes, group })

    expect(result).toHaveLength(1)
    // Oct 2 (Mon) to Oct 6 (Fri) = 5 business days
    expect(result[0].timelineMetrics!.duration).toBe(5)
  })

  it('should handle transition spanning a weekend', () => {
    // Oct 5 (Thu) to Oct 10 (Tue) = Thu, Fri, Mon, Tue = 4 business days
    const nodes: DeliveryItem[] = [
      makeNode({
        id: 'node-1',
        title: 'Weekend span',
        timeline: {
          id: 'tl-1',
          events: [
            {
              id: 'e1',
              action: 'edited',
              date: '2023-10-05T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Status',
                  from: { name: 'Todo' },
                  to: { name: 'In Progress' }
                }
              }
            },
            {
              id: 'e2',
              action: 'edited',
              date: '2023-10-10T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Status',
                  from: { name: 'In Progress' },
                  to: { name: 'Done' }
                }
              }
            }
          ]
        }
      })
    ]

    const group = makeGroup()
    const result = getStatusChange({ nodes, group })

    expect(result).toHaveLength(1)
    // Thu(5) Fri(6) Sat(7) Sun(8) Mon(9) Tue(10) -> 4 business days
    expect(result[0].timelineMetrics!.duration).toBe(4)
  })

  it('should work without valueTo (tracks leaving valueFrom status)', () => {
    const nodes: DeliveryItem[] = [
      makeNode({
        id: 'node-1',
        title: 'No valueTo',
        timeline: {
          id: 'tl-1',
          events: [
            {
              id: 'e1',
              action: 'edited',
              date: '2023-10-02T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Status',
                  from: { name: 'Todo' },
                  to: { name: 'In Progress' }
                }
              }
            },
            {
              id: 'e2',
              action: 'edited',
              date: '2023-10-04T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Status',
                  from: { name: 'In Progress' },
                  to: { name: 'Review' }
                }
              }
            }
          ]
        }
      })
    ]

    // No valueTo: track time from entering "In Progress" until leaving it
    const group = makeGroup({ valueTo: undefined })
    const result = getStatusChange({ nodes, group })

    expect(result).toHaveLength(1)
    expect(result[0].timelineMetrics!.valueFrom).toBe('In Progress')
    expect(result[0].timelineMetrics!.valueTo).toBe('Review')
  })

  it('should only consider edited actions on the specified field', () => {
    const nodes: DeliveryItem[] = [
      makeNode({
        id: 'node-1',
        title: 'Different field',
        timeline: {
          id: 'tl-1',
          events: [
            {
              id: 'e1',
              action: 'edited',
              date: '2023-10-02T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Priority', // Different field
                  from: { name: 'Low' },
                  to: { name: 'In Progress' }
                }
              }
            },
            {
              id: 'e2',
              action: 'edited',
              date: '2023-10-04T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Priority', // Different field
                  from: { name: 'In Progress' },
                  to: { name: 'Done' }
                }
              }
            }
          ]
        }
      })
    ]

    const group = makeGroup({ field: 'Status' })
    const result = getStatusChange({ nodes, group })

    expect(result).toHaveLength(0)
  })

  it('should use the most recent events (sorted descending)', () => {
    // Multiple transitions: first In Progress->Done older, second In Progress->Done newer
    const nodes: DeliveryItem[] = [
      makeNode({
        id: 'node-1',
        title: 'Multiple transitions',
        timeline: {
          id: 'tl-1',
          events: [
            {
              id: 'e1',
              action: 'edited',
              date: '2023-10-01T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Status',
                  from: { name: 'Todo' },
                  to: { name: 'In Progress' }
                }
              }
            },
            {
              id: 'e2',
              action: 'edited',
              date: '2023-10-03T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Status',
                  from: { name: 'In Progress' },
                  to: { name: 'Done' }
                }
              }
            },
            {
              id: 'e3',
              action: 'edited',
              date: '2023-10-05T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Status',
                  from: { name: 'Done' },
                  to: { name: 'In Progress' }
                }
              }
            },
            {
              id: 'e4',
              action: 'edited',
              date: '2023-10-09T10:00:00Z',
              change: {
                field_value: {
                  field_name: 'Status',
                  from: { name: 'In Progress' },
                  to: { name: 'Done' }
                }
              }
            }
          ]
        }
      })
    ]

    const group = makeGroup()
    const result = getStatusChange({ nodes, group })

    expect(result).toHaveLength(1)
    // Should use most recent: start = Oct 5 (to: In Progress), end = Oct 9 (to: Done)
    expect(result[0].timelineMetrics!.startDate).toBe('2023-10-05T10:00:00Z')
    expect(result[0].timelineMetrics!.endDate).toBe('2023-10-09T10:00:00Z')
  })
})
