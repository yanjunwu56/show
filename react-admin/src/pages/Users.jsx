import { useEffect, useState } from 'react'
import DataTable from '../components/DataTable.jsx'
import { fetchUsers } from '../api'

function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'lastSeen', label: 'Last seen', sortable: true },
  ]

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
        <p className="page-description">
          The table below supports pagination, sorting, filtering, and column
          toggles.
        </p>
        {loading ? <div className="loading">Loading users...</div> : null}
        {loading ? null : <DataTable rows={users} columns={columns} />}
      </div>
    </section>
  )
}

export default Users
