import { GitHubProjectV2Node } from '../../types/index.js'

export interface ProjectCardsResponse {
  node: GitHubProjectV2Node | null
}

export const getProjectCardsGraphQL = `
  query paginate ($projectId: ID!, $increment: Int = 30, $cursor: String) {
    node(id: $projectId) {
      ... on ProjectV2 {
        id
        title
        items (first: $increment, after: $cursor) {
          totalCount
          edges {
            cursor
            node {
              id
              updatedAt
              content {
                ... on Issue {
                  __typename
                  id
                  number
                  updatedAt
                  closedAt
                }
                ... on PullRequest {
                  __typename
                  id
                  number
                  updatedAt
                  mergedAt
                  closedAt
                }
              }
              fieldValues(first: 10) {
                nodes {
                  ... on ProjectV2ItemFieldDateValue {
                    __typename
                    field {
                      ... on ProjectV2Field {
                        name
                      }
                    }
                    date
                  }
                  ... on ProjectV2ItemFieldIterationValue {
                    __typename
                    field {
                      ... on ProjectV2IterationField {
                        name
                      }
                    }
                    title
                  }
                  ... on ProjectV2ItemFieldNumberValue {
                    __typename
                    field {
                      ... on ProjectV2Field {
                        name
                      }
                    }
                    number
                  }
                  ... on ProjectV2ItemFieldSingleSelectValue {
                    __typename
                    field {
                      ... on ProjectV2SingleSelectField {
                        name
                      }
                    }
                    name
                  }
                  ... on ProjectV2ItemFieldTextValue {
                    __typename
                    field {
                      ... on ProjectV2Field {
                        name
                      }
                    }
                    text
                  }
                }
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

export default getProjectCardsGraphQL
