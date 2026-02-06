import './App.css'
import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Users from './pages/Users.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
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
            <div className="avatar">YA</div>
          </div>
        </header>
        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
