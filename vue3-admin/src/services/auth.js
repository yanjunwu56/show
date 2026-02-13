const userKey = 'vue3-admin-user'
const tokenKey = 'vue3-admin-tokens'
const accessTokenTtl = 5 * 60 * 1000
const refreshTokenTtl = 30 * 60 * 1000

const demoUsers = [
  { username: 'admin', password: 'admin123', role: 'admin', name: 'Admin' },
  { username: 'viewer', password: 'viewer123', role: 'viewer', name: 'Viewer' }
]

const safeParse = (value) => {
  if (!value) return null
  try {
    return JSON.parse(value)
  } catch (error) {
    return null
  }
}

const getStoredUser = () => {
  const raw = localStorage.getItem(userKey)
  if (!raw) return null
  return safeParse(raw)
}

const getStoredTokens = () => safeParse(localStorage.getItem(tokenKey))

const generateTokenValue = (prefix) =>
  `${prefix}_${Math.random().toString(36).slice(2)}`

const generateTokens = () => {
  const now = Date.now()
  return {
    accessToken: generateTokenValue('access'),
    accessTokenExpiresAt: now + accessTokenTtl,
    refreshToken: generateTokenValue('refresh'),
    refreshTokenExpiresAt: now + refreshTokenTtl
  }
}

const setTokens = (tokens) => {
  localStorage.setItem(tokenKey, JSON.stringify(tokens))
}

const isExpired = (timestamp) => !timestamp || Date.now() >= timestamp

const isAccessTokenExpired = () => {
  const tokens = getStoredTokens()
  return !tokens || isExpired(tokens.accessTokenExpiresAt)
}

const isRefreshTokenExpired = () => {
  const tokens = getStoredTokens()
  return !tokens || isExpired(tokens.refreshTokenExpiresAt)
}

const refreshTokens = () => {
  if (isRefreshTokenExpired()) {
    throw new Error('Refresh token expired')
  }
  const tokens = generateTokens()
  setTokens(tokens)
  return tokens
}

const login = async (username, password) => {
  const matched = demoUsers.find(
    (user) => user.username === username && user.password === password
  )
  if (!matched) {
    throw new Error('Invalid credentials')
  }
  const sanitized = {
    username: matched.username,
    role: matched.role,
    name: matched.name
  }
  localStorage.setItem(userKey, JSON.stringify(sanitized))
  const tokens = generateTokens()
  setTokens(tokens)
  return { user: sanitized, tokens }
}

const logout = () => {
  localStorage.removeItem(userKey)
  localStorage.removeItem(tokenKey)
}

const ensureSession = () => {
  const user = getStoredUser()
  if (!user) return false
  if (isAccessTokenExpired()) {
    try {
      refreshTokens()
    } catch (error) {
      logout()
      return false
    }
  }
  return true
}

const isAuthenticated = () => ensureSession()

const hasRole = (role) => {
  const user = getStoredUser()
  return Boolean(user && user.role === role)
}

const getUser = () => getStoredUser()

const getAccessToken = () => {
  const tokens = getStoredTokens()
  return tokens?.accessToken || ''
}

const getDemoAccounts = () =>
  demoUsers.map((user) => ({
    username: user.username,
    password: user.password,
    role: user.role
  }))

export {
  login,
  logout,
  isAuthenticated,
  hasRole,
  getUser,
  getAccessToken,
  ensureSession,
  refreshTokens,
  getDemoAccounts
}
