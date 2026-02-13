const themeKey = 'vue3-admin-theme'

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(themeKey, theme)
}

const getTheme = () => localStorage.getItem(themeKey) || 'light'

const initTheme = () => {
  applyTheme(getTheme())
}

const toggleTheme = () => {
  const current = getTheme()
  const next = current === 'dark' ? 'light' : 'dark'
  applyTheme(next)
  return next
}

export { initTheme, toggleTheme, getTheme }
