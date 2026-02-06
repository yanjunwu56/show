import { useEffect, useState } from 'react'
import { fetchUsers } from '../api/mock'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    fetchUsers().then((data) => {
      if (!active) return
      setUsers(data)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="users">
      <p className="page-description">
        User data is loaded from a mock API layer to simulate server requests.
      </p>
      <div className="card filter-card">
        <div>
          <div className="card-title">User directory</div>
          <div className="card-subtitle">Search and manage access quickly</div>
        </div>
        <div className="filter-actions">
          <input className="input" type="text" placeholder="Search users" />
          <button className="ghost-button">Invite user</button>
        </div>
      </div>

      <div className="card table-card">
        <div className="table">
          <div className="table-head">
            <span>Name</span>
            <span>Role</span>
            <span>Status</span>
            <span>Last seen</span>
          </div>
          {loading ? (
            <div className="table-row">
              <span>Loading...</span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          ) : null}
          {users.map((user) => (
            <div key={user.name} className="table-row">
              <span className="strong">{user.name}</span>
              <span>{user.role}</span>
              <span className={`tag tag-${user.status.toLowerCase()}`}>
                {user.status}
              </span>
              <span>{user.lastSeen}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Users
