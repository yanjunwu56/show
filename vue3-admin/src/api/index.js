import { cached } from './cache'
import { get, post } from './client'

const fetchDashboard = () =>
  cached('dashboard', 30_000, () => get('/dashboard'))
const fetchUsers = () => cached('users', 30_000, () => get('/users'))
const fetchNotifications = () => get('/notifications')
const markNotificationRead = (id) => post('/notifications/read', { id })
const markAllNotificationsRead = () => post('/notifications/read-all')

export {
  fetchDashboard,
  fetchUsers,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead
}
