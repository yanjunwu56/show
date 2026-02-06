import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section className="not-found card">
      <div className="card-title">Page not found</div>
      <p className="card-subtitle">
        The page you are trying to reach does not exist.
      </p>
      <Link className="ghost-button" to="/dashboard">
        Go to dashboard
      </Link>
    </section>
  )
}

export default NotFound
