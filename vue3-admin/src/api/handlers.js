import { ensureSession } from '../services/auth'

const stats = [
  { label: 'Active users', value: '1,248', change: '+12%' },
  { label: 'New orders', value: '320', change: '+8%' },
  { label: 'Tickets', value: '18', change: '-4%' },
  { label: 'Conversion', value: '4.6%', change: '+0.8%' }
]

const tasks = [
  { title: 'Review new merchant requests', owner: 'Cindy', due: 'Today' },
  { title: 'Approve refund batch', owner: 'Leo', due: 'Tomorrow' },
  { title: 'Check inventory alerts', owner: 'Mia', due: 'This week' }
]

const activities = [
  { title: 'Payment confirmed for order #3841', time: '2 min ago' },
  { title: 'New user registered: Omar K.', time: '18 min ago' },
  { title: 'Server autoscaling completed', time: '1 hour ago' }
]

const orders = [
  { id: 'ORD-3841', customer: 'Ava Wilson', total: '$1,240', status: 'Paid' },
  { id: 'ORD-3842', customer: 'Noah Carter', total: '$980', status: 'Pending' },
  { id: 'ORD-3843', customer: 'Liam Hart', total: '$320', status: 'Refund' },
  { id: 'ORD-3844', customer: 'Emma Stone', total: '$540', status: 'Paid' }
]

const chart = {
  categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  revenue: [120, 200, 150, 320, 280, 260, 300],
  orders: [32, 45, 38, 60, 52, 49, 58]
}

const users = [
  {
    name: 'Ava Wilson',
    email: 'ava@northwind.com',
    role: 'Admin',
    status: 'Active',
    lastSeen: '2 hours ago'
  },
  {
    name: 'Noah Carter',
    email: 'noah@northwind.com',
    role: 'Manager',
    status: 'Active',
    lastSeen: 'Today'
  },
  {
    name: 'Mia Green',
    email: 'mia@northwind.com',
    role: 'Support',
    status: 'Invited',
    lastSeen: 'Yesterday'
  },
  {
    name: 'Liam Hart',
    email: 'liam@northwind.com',
    role: 'Analyst',
    status: 'Suspended',
    lastSeen: '3 days ago'
  },
  {
    name: 'Emma Stone',
    email: 'emma@northwind.com',
    role: 'Finance',
    status: 'Active',
    lastSeen: '5 minutes ago'
  }
]

let notifications = [
  {
    id: 'note-1',
    title: 'New payout request',
    body: 'A partner requested payout approval.',
    read: false,
    time: 'Just now'
  },
  {
    id: 'note-2',
    title: 'Weekly report ready',
    body: 'Your Monday snapshot is available.',
    read: false,
    time: '10 min ago'
  }
]

const requireAuth = () => {
  if (!ensureSession()) {
    return { status: 401, data: { message: 'Session expired' } }
  }
  return null
}

const handleRequest = async ({ method, url, data }) => {
  if (url !== '/login') {
    const authError = requireAuth()
    if (authError) return authError
  }

  if (method === 'GET' && url === '/dashboard') {
    return {
      status: 200,
      data: { stats, tasks, activities, orders, chart }
    }
  }

  if (method === 'GET' && url === '/users') {
    return { status: 200, data: users }
  }

  if (method === 'GET' && url === '/notifications') {
    return { status: 200, data: notifications }
  }

  if (method === 'POST' && url === '/notifications/read') {
    notifications = notifications.map((note) =>
      note.id === data?.id ? { ...note, read: true } : note
    )
    return { status: 200, data: notifications }
  }

  if (method === 'POST' && url === '/notifications/read-all') {
    notifications = notifications.map((note) => ({ ...note, read: true }))
    return { status: 200, data: notifications }
  }

  return { status: 404, data: { message: 'Not found' } }
}

const pushNotification = (notification) => {
  notifications = [notification, ...notifications].slice(0, 8)
  return notifications
}

export { handleRequest, pushNotification }
