import { GitHubIssue } from '../../types/index.js'

export interface IssueResponse {
  repository: {
    issue: GitHubIssue
  }
}

export const getIssueGraphQL = `
  query issue($ownerLogin: String!, $repositoryName: String!, $issueNumber: Int!) {
    repository(owner: $ownerLogin, name: $repositoryName) {
      issue(number: $issueNumber) {
        id
        title
        url
        subIssues (first: 1) {
          totalCount
        }
      }
    }
  }
`

export default getIssueGraphQL
