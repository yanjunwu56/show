const shortcutsKey = 'vue3-admin-shortcuts'

const getShortcuts = () => {
  const raw = localStorage.getItem(shortcutsKey)
  if (!raw) return []
  try {
    return JSON.parse(raw)
  } catch (error) {
    return []
  }
}

const saveShortcuts = (items) => {
  localStorage.setItem(shortcutsKey, JSON.stringify(items))
}

const toggleShortcut = (item) => {
  const current = getShortcuts()
  const exists = current.some((entry) => entry.to === item.to)
  const next = exists
    ? current.filter((entry) => entry.to !== item.to)
    : [...current, item]
  saveShortcuts(next)
  return next
}

export { getShortcuts, toggleShortcut }
