export function formatCount(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

export function getItemImage(item) {
  if (!item) return ''
  return item.cover?.url || item.thumbnail || item.video?.thumbnail || item.image || item.poster || item.profilePicture || ''
}
