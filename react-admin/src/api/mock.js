const delay = (data, time = 500) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), time)
  })

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

const chart = {
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  revenue: [120, 200, 150, 320, 280, 260, 300],
  orders: [32, 45, 38, 60, 52, 49, 58],
}

const users = [
  { name: 'Ava Wilson', role: 'Admin', status: 'Active', lastSeen: '2 hours ago' },
  { name: 'Noah Carter', role: 'Manager', status: 'Active', lastSeen: 'Today' },
  { name: 'Mia Green', role: 'Support', status: 'Invited', lastSeen: 'Yesterday' },
  { name: 'Liam Hart', role: 'Analyst', status: 'Suspended', lastSeen: '3 days ago' },
  { name: 'Emma Stone', role: 'Finance', status: 'Active', lastSeen: '5 minutes ago' },
]

const fetchDashboardData = async () =>
  delay({ stats, tasks, activities, orders, chart })

const fetchUsers = async () => delay(users)

export { fetchDashboardData, fetchUsers }
