import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'

function RequireRole({ role, children }) {
  const { user } = useAuth()

  if (!user || user.role !== role) {
    return <Navigate to="/forbidden" replace />
  }

  return children
}

export default RequireRole
