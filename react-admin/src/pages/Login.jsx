import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { getDemoAccounts } from '../auth/auth'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const demoAccounts = getDemoAccounts()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError('Invalid credentials. Try a demo account below.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (account) => {
    setForm({ username: account.username, password: account.password })
  }

  return (
    <div className="auth-layout">
      <section className="login">
        <div className="card login-card">
          <div className="card-title">Sign in</div>
          <p className="page-description">
            This login page enables permission control. Use a demo account to see
            role-based access in action.
          </p>
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="field-label">Username</span>
              <input
                className="input"
                type="text"
                value={form.username}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, username: event.target.value }))
                }
              />
            </label>
            <label className="field">
              <span className="field-label">Password</span>
              <input
                className="input"
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, password: event.target.value }))
                }
              />
            </label>
            <button className="ghost-button" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
            {error ? <p className="error">{error}</p> : null}
          </form>

          <div className="demo">
            <div className="demo-title">Demo accounts</div>
            <div className="demo-actions">
              {demoAccounts.map((account) => (
                <button
                  key={account.username}
                  type="button"
                  className="secondary-button"
                  onClick={() => fillDemo(account)}
                >
                  {account.username} ({account.role})
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
