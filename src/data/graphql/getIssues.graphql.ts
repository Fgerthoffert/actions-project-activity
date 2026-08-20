export const getIssuesGraphQL = `
  query ($nodesArray: [ID!]!) {
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
    nodes(ids: $nodesArray) {
      ... on Issue {
        __typename
        id
        title
        number
        closedAt
        stateReason
        url
        repository {
          name
          url
          owner {
            login
          }
        }
        milestone {
          state
          title
        }
        labels(first: 10) {
          nodes {
            name
          }
        }
        projectsV2(first: 10) {
          nodes {
            title
          }
        }
        issueType {
          name
        }
        issueFieldValues(first: 20) {
          nodes {
            __typename
            ... on IssueFieldNumberValue {
              value
              field {
                ... on IssueFieldNumber {
                  name
                }
              }
            }
          }
        }
        parent {
          title
        }
      }
    }
  }
`

export default getIssuesGraphQL
