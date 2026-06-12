/* eslint-disable  @typescript-eslint/no-explicit-any */

import { startOfWeek } from 'date-fns'

import {
  buildEmptyCalendar,
  getEmptyWeeks
} from '../src/metrics/buildEmptyCalendar.js'
import { DeliveryItem } from '../src/types/index.js'

describe('buildEmptyCalendar', () => {
  it('should return an empty array when no nodes are provided', () => {
    const nodes: DeliveryItem[] = []
    const result = buildEmptyCalendar(nodes)
    expect(result).toEqual([])
  })

  it('should generate a calendar with correct weeks for given nodes', () => {
    const nodes: DeliveryItem[] = [
      {
        id: '1',
        labels: [],
        mergedAt: null,
        milestone: null,
        initiative: null,
        closedAt: '2023-10-01T00:00:00Z',
        number: 1,
        points: 0,
        project: {
          value1: 'value1',
          value2: 'value2'
        },
        projectsV2: [],
        url: '',
        title: '',
        repository: {
          name: 'repo1',
          url: 'hgtps://github.com/repo1',
          owner: {
            login: 'owner1'
          }
        },
        type: 'bug'
      },
      {
        id: '2',
        labels: [],
        mergedAt: null,
        milestone: null,
        initiative: null,
        closedAt: '2023-10-15T00:00:00Z',
        number: 2,
        points: 0,
        project: {
          value1: 'value1',
          value2: 'value2'
        },
        projectsV2: [],
        repository: {
          name: 'repo1',
          url: 'hgtps://github.com/repo1',
          owner: {
            login: 'owner1'
          }
        },
        url: '',
        title: '',
        type: 'feature'
      }
    ]
    const result = buildEmptyCalendar(nodes)

    // Weeks generated depend on local timezone's startOfWeek
    expect(result.length).toBeGreaterThanOrEqual(2)
    expect(result[0].firstDay).toEqual(
      startOfWeek(new Date('2023-10-01T00:00:00Z'))
    )
  })

  it('should handle nodes with null or undefined closedAt values', () => {
    const nodes: DeliveryItem[] = [
      {
        id: '1',
        labels: [],
        mergedAt: null,
        milestone: null,
        initiative: null,
        closedAt: null,
        number: 1,
        points: 0,
        project: {
          value1: 'value1',
          value2: 'value2'
        },
        projectsV2: [],
        url: '',
        title: '',
        repository: {
          name: 'repo1',
          url: 'hgtps://github.com/repo1',
          owner: {
            login: 'owner1'
          }
        },
        type: 'bug'
      },
      {
        id: '2',
        labels: [],
        mergedAt: null,
        milestone: null,
        initiative: null,
        closedAt: '2023-10-11T00:00:00Z',
        number: 2,
        points: 0,
        project: {
          value1: 'value1',
          value2: 'value2'
        },
        projectsV2: [],
        repository: {
          name: 'repo1',
          url: 'hgtps://github.com/repo1',
          owner: {
            login: 'owner1'
          }
        },
        url: '',
        title: '',
        type: 'feature'
      },
      {
        id: '3',
        labels: [],
        mergedAt: null,
        milestone: null,
        initiative: null,
        closedAt: '2023-10-11T00:00:00Z',
        number: 2,
        points: 0,
        project: {
          value1: 'value1',
          value2: 'value2'
        },
        projectsV2: [],
        repository: {
          name: 'repo1',
          url: 'hgtps://github.com/repo1',
          owner: {
            login: 'owner1'
          }
        },
        url: '',
        title: '',
        type: 'feature'
      }
    ]
    const result = buildEmptyCalendar(nodes)

    // Only non-null dates are considered; both are the same mid-week date
    // so the calendar spans from startOfWeek to end = same week = 0 full weeks
    // (since dateCursor < endDate is checked)
    // The key assertion: null dates are excluded from range calculation
    expect(result.length).toBeLessThanOrEqual(1)
  })

  it('should generate an empty array when startDate is after endDate in getEmptyWeeks', () => {
    const startDate = new Date('2023-10-15T00:00:00Z')
    const endDate = new Date('2023-10-01T00:00:00Z')
    const result = (getEmptyWeeks as any)(startDate, endDate)
    expect(result).toEqual([])
  })

  it('should generate weeks correctly for a valid date range in getEmptyWeeks', () => {
    const startDate = new Date('2023-10-01T00:00:00Z')
    const endDate = new Date('2023-10-15T00:00:00Z')
    const result = (getEmptyWeeks as any)(startDate, endDate)

    // startOfWeek(Oct 1) to Oct 15 should span multiple weeks
    expect(result.length).toBeGreaterThanOrEqual(2)
    expect(result[0].firstDay).toEqual(startOfWeek(startDate))
    // Each subsequent week is 7 days after the previous
    const diff = result[1].firstDay.getTime() - result[0].firstDay.getTime()
    expect(diff).toBe(7 * 24 * 60 * 60 * 1000)
  })

  it('should initialize metrics and nodes correctly in getEmptyWeeks', () => {
    const startDate = new Date('2023-10-02T00:00:00Z')
    const endDate = new Date('2023-10-14T00:00:00Z')
    const result = (getEmptyWeeks as any)(startDate, endDate)

    expect(result.length).toBeGreaterThanOrEqual(1)
    expect(result[0].metrics).toEqual({
      nodes: {
        count: 0,
        velocity: 0,
        distribution: 0
      },
      points: {
        count: 0,
        velocity: 0,
        distribution: 0
      }
    })
    expect(result[0].nodes).toEqual([])
  })
})
