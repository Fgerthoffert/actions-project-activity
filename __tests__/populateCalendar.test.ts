import { populateCalendar } from '../src/metrics/populateCalendar.js'
import { MetricWeek, DeliveryItem } from '../src/types/index.js'

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

const makeWeek = (firstDay: string): MetricWeek => ({
  firstDay: new Date(firstDay),
  nodes: [],
  metrics: {
    nodes: { count: 0, velocity: 0, distribution: 0 },
    points: { count: 0, velocity: 0, distribution: 0 }
  }
})

describe('populateCalendar', () => {
  it('should assign nodes to the correct week based on closedAt date', () => {
    const nodes: DeliveryItem[] = [
      makeNode({ id: '1', closedAt: '2023-10-02T10:00:00Z', points: 3 }),
      makeNode({ id: '2', closedAt: '2023-10-03T10:00:00Z', points: 5 })
    ]

    const calendar: MetricWeek[] = [
      makeWeek('2023-10-02T00:00:00Z'),
      makeWeek('2023-10-09T00:00:00Z')
    ]

    const result = populateCalendar(nodes, calendar)

    expect(result[0].nodes).toHaveLength(2)
    expect(result[0].metrics.nodes.count).toBe(2)
    expect(result[0].metrics.points.count).toBe(8)
    expect(result[1].nodes).toHaveLength(0)
    expect(result[1].metrics.nodes.count).toBe(0)
    expect(result[1].metrics.points.count).toBe(0)
  })

  it('should handle nodes with null closedAt by treating them as epoch', () => {
    const nodes: DeliveryItem[] = [
      makeNode({ id: '1', closedAt: null, points: 2 })
    ]

    const calendar: MetricWeek[] = [makeWeek('2023-10-02T00:00:00Z')]

    const result = populateCalendar(nodes, calendar)

    // null closedAt becomes new Date(0) which is 1970, won't match 2023 week
    expect(result[0].nodes).toHaveLength(0)
    expect(result[0].metrics.nodes.count).toBe(0)
  })

  it('should handle nodes with null points by counting them as 0', () => {
    const nodes: DeliveryItem[] = [
      makeNode({ id: '1', closedAt: '2023-10-03T10:00:00Z', points: null }),
      makeNode({ id: '2', closedAt: '2023-10-04T10:00:00Z', points: 5 })
    ]

    const calendar: MetricWeek[] = [makeWeek('2023-10-02T00:00:00Z')]

    const result = populateCalendar(nodes, calendar)

    expect(result[0].nodes).toHaveLength(2)
    expect(result[0].metrics.nodes.count).toBe(2)
    expect(result[0].metrics.points.count).toBe(5)
  })

  it('should return empty calendar when no nodes provided', () => {
    const calendar: MetricWeek[] = [makeWeek('2023-10-02T00:00:00Z')]

    const result = populateCalendar([], calendar)

    expect(result[0].nodes).toHaveLength(0)
    expect(result[0].metrics.nodes.count).toBe(0)
    expect(result[0].metrics.points.count).toBe(0)
  })

  it('should return empty array when calendar is empty', () => {
    const nodes: DeliveryItem[] = [
      makeNode({ id: '1', closedAt: '2023-10-03T10:00:00Z' })
    ]

    const result = populateCalendar(nodes, [])

    expect(result).toEqual([])
  })

  it('should distribute nodes across multiple weeks correctly', () => {
    const nodes: DeliveryItem[] = [
      makeNode({ id: '1', closedAt: '2023-10-03T10:00:00Z', points: 2 }),
      makeNode({ id: '2', closedAt: '2023-10-10T10:00:00Z', points: 3 }),
      makeNode({ id: '3', closedAt: '2023-10-11T10:00:00Z', points: 4 })
    ]

    const calendar: MetricWeek[] = [
      makeWeek('2023-10-02T00:00:00Z'),
      makeWeek('2023-10-09T00:00:00Z'),
      makeWeek('2023-10-16T00:00:00Z')
    ]

    const result = populateCalendar(nodes, calendar)

    expect(result[0].metrics.nodes.count).toBe(1)
    expect(result[0].metrics.points.count).toBe(2)
    expect(result[1].metrics.nodes.count).toBe(2)
    expect(result[1].metrics.points.count).toBe(7)
    expect(result[2].metrics.nodes.count).toBe(0)
    expect(result[2].metrics.points.count).toBe(0)
  })
})
