import { get, post } from './client'

const fetchDashboard = () => get('/dashboard')
const fetchUsers = () => get('/users')
const fetchNotifications = () => get('/notifications')
const markNotificationRead = (id) => post('/notifications/read', { id })
const markAllNotificationsRead = () => post('/notifications/read-all')

export {
  fetchDashboard,
  fetchUsers,
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
}
