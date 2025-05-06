/* eslint-disable  @typescript-eslint/no-explicit-any */

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

    expect(result.length).toBe(3) // 3 weeks from 2023-10-01 to 2023-10-15
    expect(result[0].firstDay).toEqual(new Date('2023-09-30T22:00:00Z')) // Start of the week containing 2023-10-01
    expect(result[2].firstDay).toEqual(new Date('2023-10-14T22:00:00Z')) // Start of the week containing 2023-10-15
  })

  it('should handle nodes with null or undefined closedAt values', () => {
    const nodes: DeliveryItem[] = [
      {
        id: '1',
        labels: [],
        mergedAt: null,
        milestone: null,
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
      },
      {
        id: '3',
        labels: [],
        mergedAt: null,
        milestone: null,
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

    expect(result.length).toBe(1) // 3 weeks from 2023-10-01 to 2023-10-15
    expect(result[0].firstDay).toEqual(new Date('2023-10-14T22:00:00Z'))
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

    expect(result.length).toBe(3) // Two weeks between 2023-10-01 and 2023-10-15
    expect(result[0].firstDay).toEqual(new Date('2023-09-30T22:00:00Z')) // Start of the week containing 2023-10-01
    expect(result[1].firstDay).toEqual(new Date('2023-10-07T22:00:00Z')) // Start of the next week
  })

  it('should initialize metrics and nodes correctly in getEmptyWeeks', () => {
    const startDate = new Date('2023-10-01T00:00:00Z')
    const endDate = new Date('2023-10-08T00:00:00Z')
    const result = (getEmptyWeeks as any)(startDate, endDate)

    expect(result.length).toBe(2)
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
