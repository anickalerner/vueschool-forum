export const findById = (resource, id) => {
  if (!resource || !id) return null
  return resource.find((item) => item.id === id)
}

export const upsert = (resource, item) => {
  const ind = resource.findIndex((resourceItem) => resourceItem.id === item.id)
  if (item.id && ind > -1) {
    resource[ind] = item
  } else {
    resource.push(item)
  }
}

export function docToResource (doc) {
  if (typeof doc?.data !== 'function') return doc
  return { ...doc.data(), id: doc.id }
}

export const makeAppendChildToParentMutation = ({ parent, child }) => {
  return (state, { childId, parentId }) => {
    const resource = findById(state.items, parentId)
    if (!resource) {
      console.warn(
        `Appending ${child} ${childId} to ${parent} ${parentId} failed because the parent didn't exist`
      )
      return
    }
    resource[child] = resource[child] || []
    const ind = resource[child].findIndex((c) => c === childId)
    if (ind === -1) {
      resource[child].push(childId)
    }
  }
}
