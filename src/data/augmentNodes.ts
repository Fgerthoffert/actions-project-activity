import {
  GitHubProjectCard,
  GitHubIssue,
  GitHubPullRequest,
  GitHubProjectV2ItemFieldValue,
  GitHubLabel,
  GitHubProject,
  DeliveryItem,
  DeliveryItemWithInitiative
} from '../types/index.js'

/**
 * Augments a list of GitHub issues or pull requests with additional data or with mutations to simplify the
 * data structure fetched from GraphQL.
 * This function aligns the `mergedAt` date to `closedAt` for pull requests, extracts project field values,
 * calculates points based on a specified field, and adds metadata such as labels and associated projects.
 *
 * @param nodes - An array of GitHub issues or pull requests to be augmented.
 * @param githubProjectCards - An array of GitHub project cards containing additional metadata.
 * @param pointsField - The name of the field in the project cards used to calculate points.
 * @returns A new array of GitHub issues or pull requests with augmented data.
 */
export const augmentNodes = ({
  nodes,
  githubProjectCards,
  issuesWithInitiatives = [],
  pointsField
}: {
  nodes: GitHubIssue[] | GitHubPullRequest[]
  githubProjectCards: GitHubProjectCard[]
  issuesWithInitiatives?: DeliveryItemWithInitiative[]
  pointsField: string
}): DeliveryItem[] => {
  return nodes.map((node) => {
    // Align mergedAt date to closedAt to simplify the logic downstream
    // We're only
    if (node.mergedAt !== undefined && node.mergedAt !== null) {
      node = {
        ...node,
        closedAt: node.mergedAt
      }
    }
    const card = githubProjectCards.find((card) => card.content?.id === node.id)
    const initiative = issuesWithInitiatives.find(
      (issue) => issue.id === node.id
    )
    let points = 0
    let projectFields = {}
    if (card) {
      // Projects fields are not necessarily easy to parse
      // You can also refer to the source GraphQL query to learn more
      projectFields = card.fieldValues.nodes
        .filter(
          (obj: GitHubProjectV2ItemFieldValue) =>
            obj && 'field' in obj && Object.keys(obj).length > 0
        )
        .reduce(
          (
            acc: {
              [key: string]: string | number | null | undefined
            },
            obj: GitHubProjectV2ItemFieldValue
          ): {
            [key: string]: string | number | null | undefined
          } => {
            const fieldName = 'field' in obj && obj.field?.name
            if (!fieldName) return acc

            switch (obj.__typename) {
              case 'ProjectV2ItemFieldTextValue':
                acc[fieldName] = obj.text
                break
              case 'ProjectV2ItemFieldSingleSelectValue':
                acc[fieldName] = obj.name
                break
              case 'ProjectV2ItemFieldNumberValue':
                acc[fieldName] = obj.number
                break
              case 'ProjectV2ItemFieldDateValue':
                acc[fieldName] = obj.date
                break
              case 'ProjectV2ItemFieldIterationValue':
                acc[fieldName] = obj.title
                break
            }
            return acc
          },
          {}
        )
      const pointsfield = card.fieldValues.nodes
        .filter((obj) => Object.keys(obj).length > 0)
        .find(
          (
            obj
          ): obj is GitHubProjectV2ItemFieldValue & {
            field: { name: string }
          } => 'field' in obj && obj.field?.name === pointsField
        )

      if (pointsfield !== undefined) {
        if (
          pointsfield &&
          '__typename' in pointsfield &&
          pointsfield.__typename === 'ProjectV2ItemFieldNumberValue'
        ) {
          points = pointsfield.number
        }
      }
    }
    return {
      ...node,
      points: points,
      type: node.__typename,
      labels: node.labels.nodes.map((label: GitHubLabel) => label.name),
      projectsV2: node.projectsV2.nodes.map(
        (project: GitHubProject) => project.title
      ),
      project: {
        ...projectFields
      },
      initiative: initiative !== undefined ? initiative.initiative : null
    }
  })
}

export default augmentNodes
