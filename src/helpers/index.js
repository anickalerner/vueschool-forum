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
