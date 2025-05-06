export const getPullRequestsGraphQL = `
  query ($nodesArray: [ID!]!) {
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
    nodes(ids: $nodesArray) {
      ... on PullRequest {
        __typename
        id
        title
        number
        closedAt
        mergedAt
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
      }
    }
  }
`

export default getPullRequestsGraphQL
