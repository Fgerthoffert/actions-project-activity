import { GitHubIssue } from '../../types/index.js'

export interface SubIssuesResponse {
  node: {
    subIssues: {
      edges: Array<{
        cursor: string
        node: GitHubIssue & {
          id: string
          title: string
          subIssues: {
            totalCount: number
          }
        }
      }>
    }
  } | null
}

export const getSubIssuesGraphQL = `
  query paginate ($issueId: ID!, $increment: Int = 30, $cursor: String) {
    node(id: $issueId) {
      ... on Issue {
        id
        title
        subIssues (first: $increment, after: $cursor) {
          totalCount
          edges {
            cursor
            node {
              id
              title
              subIssues (first: 1) {
                totalCount
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  }
`

export default getSubIssuesGraphQL
