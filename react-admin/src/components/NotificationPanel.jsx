function NotificationPanel({
  notifications,
  unreadCount,
  onClose,
  onMarkRead,
  onMarkAll,
}) {
  return (
    <div className="notification-panel">
      <div className="notification-header">
        <div>
          <div className="card-title">Notifications</div>
          <div className="card-subtitle">
            Updated through the mock WebSocket feed.
          </div>
        </div>
        <button className="secondary-button" type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="notification-actions">
        <span>{unreadCount} unread</span>
        <button className="ghost-button" type="button" onClick={onMarkAll}>
          Mark all read
        </button>
      </div>
      <div className="notification-list">
        {notifications.map((note) => (
          <div
            key={note.id}
            className={`notification-item${note.read ? '' : ' unread'}`}
          >
            <div>
              <div className="notification-title">{note.title}</div>
              <div className="notification-body">{note.body}</div>
              <div className="notification-time">{note.time}</div>
            </div>
            <button
              className="secondary-button"
              type="button"
              onClick={() => onMarkRead(note.id)}
            >
              Mark read
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationPanel
