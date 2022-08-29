export const findById = (resource, id) => {
  return resource.find(item => item.id === id)
}
