const stats = [
  { label: 'Active users', value: '1,248', change: '+12%' },
  { label: 'New orders', value: '320', change: '+8%' },
  { label: 'Tickets', value: '18', change: '-4%' },
  { label: 'Conversion', value: '4.6%', change: '+0.8%' },
]

const tasks = [
  { title: 'Review new merchant requests', owner: 'Cindy', due: 'Today' },
  { title: 'Approve refund batch', owner: 'Leo', due: 'Tomorrow' },
  { title: 'Check inventory alerts', owner: 'Mia', due: 'This week' },
]

const activities = [
  { title: 'Payment confirmed for order #3841', time: '2 min ago' },
  { title: 'New user registered: Omar K.', time: '18 min ago' },
  { title: 'Server autoscaling completed', time: '1 hour ago' },
]

const orders = [
  { id: 'ORD-3841', customer: 'Ava Wilson', total: '$1,240', status: 'Paid' },
  { id: 'ORD-3842', customer: 'Noah Carter', total: '$980', status: 'Pending' },
  { id: 'ORD-3843', customer: 'Liam Hart', total: '$320', status: 'Refund' },
  { id: 'ORD-3844', customer: 'Emma Stone', total: '$540', status: 'Paid' },
]

function Dashboard() {
  return (
    <section className="dashboard">
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="card stat-card">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-change">{stat.change}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title">Pending tasks</div>
          <ul className="list">
            {tasks.map((task) => (
              <li key={task.title} className="list-item">
                <div className="list-title">{task.title}</div>
                <div className="list-meta">
                  Owner: {task.owner} · Due: {task.due}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="card-title">Recent activity</div>
          <ul className="list">
            {activities.map((item) => (
              <li key={item.title} className="list-item">
                <div className="list-title">{item.title}</div>
                <div className="list-meta">{item.time}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card table-card">
        <div className="card-title">Latest orders</div>
        <div className="table">
          <div className="table-head">
            <span>Order</span>
            <span>Customer</span>
            <span>Total</span>
            <span>Status</span>
          </div>
          {orders.map((order) => (
            <div key={order.id} className="table-row">
              <span>{order.id}</span>
              <span>{order.customer}</span>
              <span>{order.total}</span>
              <span className={`tag tag-${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Dashboard
