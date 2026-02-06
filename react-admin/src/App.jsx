import './App.css'
import { NavLink, Route, Routes, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'
import RequireAuth from './auth/RequireAuth'
import RequireRole from './auth/RequireRole'
import Dashboard from './pages/Dashboard.jsx'
import Forbidden from './pages/Forbidden.jsx'
import Login from './pages/Login.jsx'
import Users from './pages/Users.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

function AppLayout({ user, onLogout }) {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/users', label: 'Users' },
    { to: '/settings', label: 'Settings' },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-badge">RA</div>
          <div>
            <div className="brand-title">React Admin</div>
            <div className="brand-subtitle">Lightweight control center</div>
          </div>
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-item${isActive ? ' active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot"></span>
          <span>System healthy</span>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div>
            <div className="page-title">Admin overview</div>
            <div className="page-subtitle">
              12 items are waiting for your review today
            </div>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button">New report</button>
            {user ? (
              <div className="user-pill">
                {user.name} · {user.role}
              </div>
            ) : null}
            <button className="secondary-button" onClick={onLogout}>
              Log out
            </button>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  const { user, logout } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<AppLayout user={user} onLogout={logout} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route
            path="settings"
            element={
              <RequireRole role="admin">
                <Settings />
              </RequireRole>
            }
          />
          <Route path="forbidden" element={<Forbidden />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
