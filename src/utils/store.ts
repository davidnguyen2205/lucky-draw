// Extract which fields exist
export function extractFields(data: any) {
  const item = data[0]
  // Exclude id x y, add all others to array
  const keys = Object.keys(item).filter(key => key !== 'id' && key !== 'x' && key !== 'y')
  if (keys.length > 0) {
    // Return array key value
    return keys.map(key => ({ label: key, value: true }))
  }
}
