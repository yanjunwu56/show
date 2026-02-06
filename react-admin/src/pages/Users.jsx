const users = [
  { name: 'Ava Wilson', role: 'Admin', status: 'Active', lastSeen: '2 hours ago' },
  { name: 'Noah Carter', role: 'Manager', status: 'Active', lastSeen: 'Today' },
  { name: 'Mia Green', role: 'Support', status: 'Invited', lastSeen: 'Yesterday' },
  { name: 'Liam Hart', role: 'Analyst', status: 'Suspended', lastSeen: '3 days ago' },
  { name: 'Emma Stone', role: 'Finance', status: 'Active', lastSeen: '5 minutes ago' },
]

function Users() {
  return (
    <section className="users">
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
