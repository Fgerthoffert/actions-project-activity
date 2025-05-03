import buildMovingAverage from '../src/metrics/buildMovingAverage.js'
import { MetricWeek } from '../src/types/index.js'

describe('buildMovingAverage', () => {
  it('should calculate moving average with default window size', () => {
    const calendar: MetricWeek[] = [
      {
        nodes: [{ points: 5 }, { points: 3 }],
        metrics: { nodes: {}, points: {} }
      },
      {
        nodes: [{ points: 8 }],
        metrics: { nodes: {}, points: {} }
      },
      {
        nodes: [{ points: 2 }, { points: 4 }, { points: 6 }],
        metrics: { nodes: {}, points: {} }
      }
    ]

    const result = buildMovingAverage(calendar)

    expect(result).toHaveLength(calendar.length)
    expect(result[0].metrics.velocityWindow).toBe(1)
    expect(result[0].metrics.velocityNodes).toEqual([
      { points: 5 },
      { points: 3 }
    ])
    expect(result[0].metrics.nodes.velocity).toBe(2)
    expect(result[0].metrics.points.velocity).toBe(8)

    expect(result[1].metrics.velocityWindow).toBe(2)
    expect(result[1].metrics.velocityNodes).toEqual([
      { points: 8 },
      { points: 5 },
      { points: 3 }
    ])
    expect(result[1].metrics.nodes.velocity).toBe(3)
    expect(result[1].metrics.points.velocity).toBe(8.7)

    expect(result[2].metrics.velocityWindow).toBe(3)
    expect(result[2].metrics.velocityNodes).toEqual([
      { points: 2 },
      { points: 4 },
      { points: 6 },
      { points: 8 },
      { points: 5 },
      { points: 3 }
    ])
    expect(result[2].metrics.nodes.velocity).toBe(6)
    expect(result[2].metrics.points.velocity).toBe(9.7)
  })

  it('should calculate moving average with custom window size', () => {
    const calendar: MetricWeek[] = [
      {
        nodes: [{ points: 5 }],
        metrics: { nodes: {}, points: {} }
      },
      {
        nodes: [{ points: 10 }],
        metrics: { nodes: {}, points: {} }
      },
      {
        nodes: [{ points: 15 }],
        metrics: { nodes: {}, points: {} }
      }
    ]

    const result = buildMovingAverage(calendar, 2)

    expect(result).toHaveLength(calendar.length)
    expect(result[0].metrics.velocityWindow).toBe(1)
    expect(result[0].metrics.nodes.velocity).toBe(1)
    expect(result[0].metrics.points.velocity).toBe(5)

    expect(result[1].metrics.velocityWindow).toBe(2)
    expect(result[1].metrics.nodes.velocity).toBe(2)
    expect(result[1].metrics.points.velocity).toBe(7.5)

    expect(result[2].metrics.velocityWindow).toBe(2)
    expect(result[2].metrics.nodes.velocity).toBe(2)
    expect(result[2].metrics.points.velocity).toBe(12.5)
  })

  it('should handle empty calendar', () => {
    const calendar: MetricWeek[] = []

    const result = buildMovingAverage(calendar)

    expect(result).toEqual([])
  })

  it('should handle weeks with no nodes', () => {
    const calendar: MetricWeek[] = [
      {
        nodes: [],
        metrics: { nodes: {}, points: {} }
      },
      {
        nodes: [],
        metrics: { nodes: {}, points: {} }
      }
    ]

    const result = buildMovingAverage(calendar)

    expect(result).toHaveLength(calendar.length)
    result.forEach((week) => {
      expect(week.metrics.velocityWindow).toBe(1)
      expect(week.metrics.nodes.velocity).toBe(0)
      expect(week.metrics.points.velocity).toBe(0)
    })
  })
})
