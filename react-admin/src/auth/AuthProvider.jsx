import { createContext, useContext, useMemo, useState } from 'react'
import {
  ensureSession,
  getUser,
  login as loginService,
  logout as logoutService,
} from './auth'

const AuthContext = createContext(null)

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (ensureSession() ? getUser() : null))

  const login = async (username, password) => {
    const loggedIn = await loginService(username, password)
    setUser(loggedIn.user)
    return loggedIn.user
  }

  const logout = () => {
    logoutService()
    setUser(null)
  }

  const value = useMemo(() => ({ user, login, logout }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export { AuthProvider, useAuth }
