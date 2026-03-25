import { useEffect, useMemo, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import { fetchUsers } from '../api'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(30)
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lastSeen', label: 'Last seen', sortable: true },
  ]
  const displayedUsers = useMemo(
    () => users.slice(0, visibleCount),
    [users, visibleCount],
  )

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
          <label className="table-select">
            Virtual rows
            <input
              className="input small-input"
              type="number"
              min="10"
              max="200"
              value={visibleCount}
              onChange={(event) => setVisibleCount(Number(event.target.value))}
            />
          </label>
          <input className="input" type="text" placeholder="Search users" />
          <button className="ghost-button">Invite user</button>
        </div>
      </div>

      <div className="card table-card">
        <p className="page-description">
          The table below supports pagination, sorting, filtering, and column
          toggles. The virtual rows slider limits rendered rows for performance.
        </p>
        {loading ? <div className="loading">Loading users...</div> : null}
        {loading ? null : <DataTable rows={displayedUsers} columns={columns} />}
      </div>
    </section>
  )
}

export default Users
