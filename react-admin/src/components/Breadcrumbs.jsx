import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'

const breadcrumbMap = {
  '/dashboard': 'dashboard',
  '/users': 'users',
  '/settings': 'settings',
  '/forbidden': 'forbidden',
}

function Breadcrumbs() {
  const location = useLocation()
  const { t } = useI18n()
  const segments = location.pathname.split('/').filter(Boolean)

  const crumbs = segments.map((segment, index) => {
    const to = `/${segments.slice(0, index + 1).join('/')}`
    const key = breadcrumbMap[to] || segment
    return { to, label: t(key) }
  })

  return (
    <nav className="breadcrumbs">
      {crumbs.map((crumb, index) => (
        <Link
          key={crumb.to}
          to={crumb.to}
          className={`breadcrumb${index === crumbs.length - 1 ? ' current' : ''}`}
        >
          {crumb.label}
          {index !== crumbs.length - 1 ? (
            <span className="breadcrumb-sep">/</span>
          ) : null}
        </Link>
      ))}
    </nav>
  )
}

export default Breadcrumbs
