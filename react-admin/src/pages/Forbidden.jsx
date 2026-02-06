import { Link } from 'react-router-dom'

function Forbidden() {
  return (
    <section className="card forbidden">
      <div className="card-title">Access denied</div>
      <p className="page-description">
        You do not have permission to view this page. Switch to an admin account
        to continue.
      </p>
      <Link className="ghost-button" to="/dashboard">
        Return to dashboard
      </Link>
    </section>
  )
}

export default Forbidden
