import { buildDistribution } from '../src/metrics/buildDistribution.js'
import { MetricWeek, MetricStream } from '../src/types/index.js'

const makeWeek = (
  firstDay: Date,
  nodesCount: number,
  pointsCount: number
): MetricWeek => ({
  firstDay,
  nodes: [],
  metrics: {
    nodes: { count: nodesCount, velocity: 0, distribution: 0 },
    points: { count: pointsCount, velocity: 0, distribution: 0 }
  }
})

const makeStream = (weeks: MetricWeek[]): MetricStream => ({
  name: 'Test Stream',
  description: 'Test',
  nodes: [],
  query: {},
  weeks
})

describe('buildDistribution', () => {
  it('should calculate distribution percentages for nodes and points', () => {
    const week1Date = new Date('2023-10-02')
    const week2Date = new Date('2023-10-09')

    const allNodesWeeks: MetricWeek[] = [
      makeWeek(week1Date, 10, 50),
      makeWeek(week2Date, 20, 100)
    ]

    const streams: MetricStream[] = [
      makeStream([makeWeek(week1Date, 3, 15), makeWeek(week2Date, 8, 40)])
    ]

    const result = buildDistribution(allNodesWeeks, streams)

    // Week 1: nodes distribution = 3/10 * 100 = 30%, points = 15/50 * 100 = 30%
    expect(result[0].weeks[0].metrics.nodes.distribution).toBe(30)
    expect(result[0].weeks[0].metrics.points.distribution).toBe(30)

    // Week 2: nodes distribution = 8/20 * 100 = 40%, points = 40/100 * 100 = 40%
    expect(result[0].weeks[1].metrics.nodes.distribution).toBe(40)
    expect(result[0].weeks[1].metrics.points.distribution).toBe(40)
  })

  it('should handle multiple streams', () => {
    const weekDate = new Date('2023-10-02')

    const allNodesWeeks: MetricWeek[] = [makeWeek(weekDate, 10, 100)]

    const streams: MetricStream[] = [
      makeStream([makeWeek(weekDate, 3, 30)]),
      makeStream([makeWeek(weekDate, 7, 70)])
    ]

    const result = buildDistribution(allNodesWeeks, streams)

    expect(result[0].weeks[0].metrics.nodes.distribution).toBe(30)
    expect(result[0].weeks[0].metrics.points.distribution).toBe(30)
    expect(result[1].weeks[0].metrics.nodes.distribution).toBe(70)
    expect(result[1].weeks[0].metrics.points.distribution).toBe(70)
  })

  it('should return week unchanged when no matching allNodesWeek is found', () => {
    const allNodesWeeks: MetricWeek[] = [
      makeWeek(new Date('2023-10-02'), 10, 50)
    ]

    const streams: MetricStream[] = [
      makeStream([makeWeek(new Date('2023-10-09'), 5, 25)])
    ]

    const result = buildDistribution(allNodesWeeks, streams)

    // No matching week, distribution should remain 0 (unchanged)
    expect(result[0].weeks[0].metrics.nodes.distribution).toBe(0)
    expect(result[0].weeks[0].metrics.points.distribution).toBe(0)
  })

  it('should handle empty streams array', () => {
    const allNodesWeeks: MetricWeek[] = [
      makeWeek(new Date('2023-10-02'), 10, 50)
    ]

    const result = buildDistribution(allNodesWeeks, [])

    expect(result).toEqual([])
  })

  it('should handle streams with empty weeks', () => {
    const allNodesWeeks: MetricWeek[] = [
      makeWeek(new Date('2023-10-02'), 10, 50)
    ]

    const streams: MetricStream[] = [makeStream([])]

    const result = buildDistribution(allNodesWeeks, streams)

    expect(result[0].weeks).toEqual([])
  })

  it('should round distribution to 2 decimal places', () => {
    const weekDate = new Date('2023-10-02')

    const allNodesWeeks: MetricWeek[] = [makeWeek(weekDate, 3, 3)]

    const streams: MetricStream[] = [makeStream([makeWeek(weekDate, 1, 1)])]

    const result = buildDistribution(allNodesWeeks, streams)

    // 1/3 * 100 = 33.33...
    expect(result[0].weeks[0].metrics.nodes.distribution).toBe(33.33)
    expect(result[0].weeks[0].metrics.points.distribution).toBe(33.33)
  })
})
