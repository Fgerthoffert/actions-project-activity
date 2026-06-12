import { getMetrics } from '../src/timelineMetrics/getMetrics.js'
import { DeliveryItem } from '../src/types/index.js'

const makeNode = (duration: number): DeliveryItem => ({
  id: `node-${duration}`,
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
  title: `Node with duration ${duration}`,
  repository: {
    name: 'repo',
    url: 'https://github.com/repo',
    owner: { login: 'owner' }
  },
  type: 'issue',
  timelineMetrics: {
    duration,
    startDate: '2023-10-01T00:00:00Z',
    endDate: '2023-10-05T00:00:00Z',
    valueFrom: 'In Progress',
    valueTo: 'Done'
  }
})

describe('getMetrics', () => {
  it('should return undefined when nodes have no timelineMetrics', () => {
    const nodes: DeliveryItem[] = [
      {
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
        title: 'No metrics',
        repository: {
          name: 'repo',
          url: 'https://github.com/repo',
          owner: { login: 'owner' }
        },
        type: 'issue'
      }
    ]

    const result = getMetrics({ nodes })

    expect(result).toBeUndefined()
  })

  it('should return undefined for empty nodes array', () => {
    const result = getMetrics({ nodes: [] })

    expect(result).toBeUndefined()
  })

  it('should calculate correct metrics for a single node', () => {
    const nodes = [makeNode(5)]

    const result = getMetrics({ nodes })

    expect(result).toBeDefined()
    expect(result!.median).toBe(5)
    expect(result!.min).toBe(5)
    expect(result!.max).toBe(5)
    expect(result!.datapoints).toEqual([5])
  })

  it('should calculate correct median for odd number of nodes', () => {
    const nodes = [makeNode(1), makeNode(3), makeNode(5)]

    const result = getMetrics({ nodes })

    expect(result!.median).toBe(3)
    expect(result!.min).toBe(1)
    expect(result!.max).toBe(5)
  })

  it('should calculate correct median for even number of nodes', () => {
    const nodes = [makeNode(2), makeNode(4), makeNode(6), makeNode(8)]

    const result = getMetrics({ nodes })

    expect(result!.median).toBe(5) // (4 + 6) / 2
    expect(result!.min).toBe(2)
    expect(result!.max).toBe(8)
  })

  it('should calculate l90 metrics (lowest 90%)', () => {
    // 10 nodes so 90% = 9 lowest values
    const nodes = [
      makeNode(1),
      makeNode(2),
      makeNode(3),
      makeNode(4),
      makeNode(5),
      makeNode(6),
      makeNode(7),
      makeNode(8),
      makeNode(9),
      makeNode(100)
    ]

    const result = getMetrics({ nodes })

    expect(result!.datapoints).toHaveLength(10)
    expect(result!.max).toBe(100)
    expect(result!.l90.datapoints).toHaveLength(9)
    expect(result!.l90.max).toBe(9)
    expect(result!.l90.min).toBe(1)
  })

  it('should handle nodes with identical durations', () => {
    const nodes = [makeNode(5), makeNode(5), makeNode(5)]

    const result = getMetrics({ nodes })

    expect(result!.median).toBe(5)
    expect(result!.min).toBe(5)
    expect(result!.max).toBe(5)
  })
})
