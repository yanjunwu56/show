import './App.css'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import {
  NavLink,
  Route,
  Routes,
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'
import { useAuth } from './auth/AuthProvider'
import RequireAuth from './auth/RequireAuth'
import RequireRole from './auth/RequireRole'
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from './api'
import { pushNotification } from './api/handlers'
import Breadcrumbs from './components/Breadcrumbs.jsx'
import { useI18n } from './i18n/I18nProvider'
import { getShortcuts, toggleShortcut } from './shortcuts/shortcuts'
import { getTheme, toggleTheme } from './theme/theme'
import { connect, disconnect, onMessage } from './websocket/socket'
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'))
const NotificationPanel = lazy(() =>
  import('./components/NotificationPanel.jsx'),
)
const Forbidden = lazy(() => import('./pages/Forbidden.jsx'))
const Hooks = lazy(() => import('./pages/Hooks.jsx'))
const Login = lazy(() => import('./pages/Login.jsx'))
const Users = lazy(() => import('./pages/Users.jsx'))
const Settings = lazy(() => import('./pages/Settings.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

const titleMap = {
  '/dashboard': 'dashboard',
  '/users': 'users',
  '/hooks': 'hooks',
  '/settings': 'settings',
  '/forbidden': 'forbidden',
}

function AppLayout({ user, onLogout }) {
  const location = useLocation()
  const { t, locale, setLocale } = useI18n()
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', key: 'dashboard' },
    { to: '/users', label: 'Users', key: 'users' },
    { to: '/hooks', label: 'Hooks', key: 'hooks' },
    { to: '/settings', label: 'Settings', key: 'settings' },
  ]
  const [shortcuts, setShortcuts] = useState(() => getShortcuts())
  const [notifications, setNotifications] = useState([])
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [theme, setTheme] = useState(getTheme())

  const pageTitle = useMemo(() => {
    const key = titleMap[location.pathname] || 'dashboard'
    return t(key)
  }, [location.pathname, t])

  const unreadCount = useMemo(
    () => notifications.filter((note) => !note.read).length,
    [notifications],
  )

  useEffect(() => {
    let active = true
    fetchNotifications().then((data) => {
      if (!active) return
      setNotifications(data)
    })
    connect()
    const unsubscribe = onMessage((message) => {
      setNotifications(pushNotification(message))
    })
    return () => {
      active = false
      unsubscribe()
      disconnect()
    }
  }, [])

  useEffect(() => {
    schedulePrefetch()
  }, [])

  const handleToggleShortcut = (item) => {
    setShortcuts(toggleShortcut(item))
  }

  const isShortcut = (item) =>
    shortcuts.some((shortcut) => shortcut.to === item.to)

  const handleMarkRead = async (id) => {
    setNotifications(await markNotificationRead(id))
  }

  const handleMarkAll = async () => {
    setNotifications(await markAllNotificationsRead())
  }

  const handleToggleTheme = () => {
    setTheme(toggleTheme())
  }

  const schedulePrefetch = () => {
    const prefetch = () => {
      // Preload heavy routes after idle time.
      import('./pages/Settings.jsx')
      import('./pages/Hooks.jsx')
    }
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(prefetch)
    } else {
      setTimeout(prefetch, 800)
    }
  }

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
            <div key={item.to} className="nav-item-row">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `nav-item${isActive ? ' active' : ''}`
                }
              >
                {t(item.key)}
              </NavLink>
              <button
                className="pin-button"
                type="button"
                onClick={() => handleToggleShortcut(item)}
              >
                {isShortcut(item) ? '★' : '☆'}
              </button>
            </div>
          ))}
        </nav>
        <div className="shortcuts">
          <div className="shortcuts-title">{t('shortcuts')}</div>
          {shortcuts.map((item) => (
            <NavLink key={item.to} to={item.to} className="shortcut-item">
              {t(item.key)}
            </NavLink>
          ))}
          {shortcuts.length === 0 ? (
            <div className="shortcuts-empty">
              Pin pages to build shortcuts.
            </div>
          ) : null}
        </div>
        <div className="sidebar-footer">
          <span className="status-dot"></span>
          <span>System healthy</span>
        </div>
      </aside>
      <div className="main">
        <header className="topbar">
          <div className="topbar-left">
            <Breadcrumbs />
            <div>
              <div className="page-title">{pageTitle}</div>
              <div className="page-subtitle">
                12 items are waiting for your review today
              </div>
            </div>
          </div>
          <div className="topbar-actions">
            <button className="ghost-button">New report</button>
            <button
              className="icon-button"
              type="button"
              onClick={() => setNotificationsOpen((prev) => !prev)}
            >
              🔔
              {unreadCount ? <span className="badge">{unreadCount}</span> : null}
            </button>
            <label className="select-label">
              {t('language')}
              <select
                className="input small-input"
                value={locale}
                onChange={(event) => setLocale(event.target.value)}
              >
                <option value="en">EN</option>
                <option value="de">DE</option>
              </select>
            </label>
            <button className="secondary-button" onClick={handleToggleTheme}>
              {t('theme')}: {theme}
            </button>
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
        {notificationsOpen ? (
          <Suspense fallback={<div className="loading">Loading panel...</div>}>
            <NotificationPanel
              notifications={notifications}
              unreadCount={unreadCount}
              onClose={() => setNotificationsOpen(false)}
              onMarkRead={handleMarkRead}
              onMarkAll={handleMarkAll}
            />
          </Suspense>
        ) : null}
        <main className="content">
          <Suspense fallback={<div className="loading">Loading page...</div>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

function App() {
  const { user, logout } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Suspense fallback={<div className="loading">Loading page...</div>}>
            <Login />
          </Suspense>
        }
      />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<AppLayout user={user} onLogout={logout} />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="hooks" element={<Hooks />} />
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
