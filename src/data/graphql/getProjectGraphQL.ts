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
