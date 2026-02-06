const storageKey = 'react-admin-user'

const demoUsers = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin' },
  { username: 'viewer', password: 'viewer123', role: 'viewer', name: 'Viewer' },
]

const getStoredUser = () => {
  const raw = localStorage.getItem(storageKey)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch (error) {
    return null
  }
}

const login = async (username, password) => {
  const matched = demoUsers.find(
    (user) => user.username === username && user.password === password,
  )
  if (!matched) {
    throw new Error('Invalid credentials')
  }
  const sanitized = {
    username: matched.username,
    role: matched.role,
    name: matched.name,
  }
  localStorage.setItem(storageKey, JSON.stringify(sanitized))
  return sanitized
}

const logout = () => {
  localStorage.removeItem(storageKey)
}

const getUser = () => getStoredUser()

const getDemoAccounts = () =>
  demoUsers.map((user) => ({
    username: user.username,
    password: user.password,
    role: user.role,
  }))

export { getDemoAccounts, getUser, login, logout }
