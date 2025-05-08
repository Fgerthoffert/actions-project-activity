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
        parent {
          title
        }          
      }
    }
  }
`

export default getIssuesGraphQL
