import { GitHubProject } from '../../types/index.js'

export interface ProjectResponse {
  organization: {
    projectV2: GitHubProject
  }
}

export const getProjectGraphQL = `
  query project($ownerLogin: String!, $projectNumber: Int!) {
    organization(login: $ownerLogin) {
      projectV2(number: $projectNumber) {
        id
        title
        items (first: 1) {
          totalCount
        }
      }
    }
  }
`

export default getProjectGraphQL
