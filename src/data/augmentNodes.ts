export const augmentNodes = (
  nodes: Array<any>,
  githubProjectCards: Array<any>,
  pointsField: string
): Array<any> => {
  return nodes.map((node: any) => {
    // Align mergedAt date to closedAt to simplify the logic downstream
    if (node.mergedAt !== undefined && node.mergedAt !== null) {
      node = {
        ...node,
        closedAt: node.mergedAt
      }
    }
    const card = githubProjectCards.find(
      (card: any) => card.content.id === node.id
    )
    if (card) {
      const projectFields = card.fieldValues.nodes
        .filter((obj: any) => Object.keys(obj).length > 0)
        .reduce((acc: any, obj: any) => {
          if (obj.__typename === 'ProjectV2FieldValue') {
            acc[obj.field.name] = obj.text
          } else if (obj.__typename === 'ProjectV2ItemFieldTextValue') {
            acc[obj.field.name] = obj.text
          } else if (obj.__typename === 'ProjectV2ItemFieldSingleSelectValue') {
            acc[obj.field.name] = obj.name
          } else if (obj.__typename === 'ProjectV2ItemFieldNumberValue') {
            acc[obj.field.name] = obj.number
          } else if (obj.__typename === 'ProjectV2ItemFieldDateValue') {
            acc[obj.field.name] = obj.date
          } else if (obj.__typename === 'ProjectV2ItemFieldIterationValue') {
            acc[obj.field.name] = obj.title
          } else if (obj.name !== undefined) {
            acc[obj.field.name] = obj.name
          }
          return acc
        }, {})
      const pointsfield = card.fieldValues.nodes
        .filter((obj: any) => Object.keys(obj).length > 0)
        .find((obj: any) => obj.field.name === pointsField)
      let points = 0
      if (pointsfield !== undefined) {
        points = pointsfield.number
      }
      return {
        ...node,
        points: points,
        type: node.__typename,
        labels: node.labels.nodes.map((label: any) => label.name),
        projectsV2: node.projectsV2.nodes.map((project: any) => project.title),
        project: {
          ...projectFields
        }
      }
    }
    return node
  })
}

export default augmentNodes
