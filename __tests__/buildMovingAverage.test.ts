/* eslint-disable  @typescript-eslint/no-explicit-any */

import buildMovingAverage from '../src/metrics/buildMovingAverage.js'
import { MetricWeek } from '../src/types/index.js'

describe('buildMovingAverage', () => {
  it('should calculate moving average with default window size', () => {
    const calendar: MetricWeek[] = [
      {
        firstDay: new Date('2023-10-01'),
        nodes: [{ points: 5 }, { points: 3 }] as any,
        metrics: {
          nodes: { count: 0, velocity: 0, distribution: 0 },
          points: { count: 0, velocity: 0, distribution: 0 }
        }
      },
      {
        firstDay: new Date('2023-10-08'),
        nodes: [{ points: 8 }] as any,
        metrics: {
          nodes: { count: 0, velocity: 0, distribution: 0 },
          points: { count: 0, velocity: 0, distribution: 0 }
        }
      },
      {
        firstDay: new Date('2023-10-15'),
        nodes: [{ points: 2 }, { points: 4 }, { points: 6 }] as any,
        metrics: {
          nodes: { count: 0, velocity: 0, distribution: 0 },
          points: { count: 0, velocity: 0, distribution: 0 }
        }
      }
    ]

    const result = buildMovingAverage(calendar) as any

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
    expect(result[1].metrics.nodes.velocity).toBe(1.5)
    expect(result[1].metrics.points.velocity).toBe(8)

    expect(result[2].metrics.velocityWindow).toBe(3)
    expect(result[2].metrics.velocityNodes).toEqual([
      { points: 2 },
      { points: 4 },
      { points: 6 },
      { points: 8 },
      { points: 5 },
      { points: 3 }
    ])
    expect(result[2].metrics.nodes.velocity).toBe(2)
    expect(result[2].metrics.points.velocity).toBe(9.3)
  })

  it('should calculate moving average with custom window size', () => {
    const calendar: MetricWeek[] = [
      {
        firstDay: new Date('2023-10-01'),
        nodes: [{ points: 5 }] as any,
        metrics: {
          nodes: { count: 0, velocity: 0, distribution: 0 },
          points: { count: 0, velocity: 0, distribution: 0 }
        }
      },
      {
        firstDay: new Date('2023-10-08'),
        nodes: [{ points: 10 }] as any,
        metrics: {
          nodes: { count: 0, velocity: 0, distribution: 0 },
          points: { count: 0, velocity: 0, distribution: 0 }
        }
      },
      {
        firstDay: new Date('2023-10-15'),
        nodes: [{ points: 15 }] as any,
        metrics: {
          nodes: { count: 0, velocity: 0, distribution: 0 },
          points: { count: 0, velocity: 0, distribution: 0 }
        }
      }
    ]

    const result = buildMovingAverage(calendar, 2) as any

    expect(result).toHaveLength(calendar.length)
    expect(result[0].metrics.velocityWindow).toBe(1)
    expect(result[0].metrics.nodes.velocity).toBe(1)
    expect(result[0].metrics.points.velocity).toBe(5)

    expect(result[1].metrics.velocityWindow).toBe(2)
    expect(result[1].metrics.nodes.velocity).toBe(1)
    expect(result[1].metrics.points.velocity).toBe(7.5)

    expect(result[2].metrics.velocityWindow).toBe(2)
    expect(result[2].metrics.nodes.velocity).toBe(1)
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
        firstDay: new Date('2023-10-01'),
        nodes: [],
        metrics: {
          nodes: { count: 0, velocity: 0, distribution: 0 },
          points: { count: 0, velocity: 0, distribution: 0 }
        }
      },
      {
        firstDay: new Date('2023-10-08'),
        nodes: [],
        metrics: {
          nodes: { count: 0, velocity: 0, distribution: 0 },
          points: { count: 0, velocity: 0, distribution: 0 }
        }
      }
    ]

    const result = buildMovingAverage(calendar) as any

    expect(result).toHaveLength(calendar.length)
    expect(result[0].metrics.velocityWindow).toBe(1)
    expect(result[0].metrics.nodes.velocity).toBe(0)
    expect(result[0].metrics.points.velocity).toBe(0)
    expect(result[1].metrics.velocityWindow).toBe(2)
    expect(result[1].metrics.nodes.velocity).toBe(0)
    expect(result[1].metrics.points.velocity).toBe(0)
  })
})
