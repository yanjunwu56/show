import { useState } from 'react'

function Settings() {
  const [form, setForm] = useState({
    company: 'Northwind',
    timezone: 'UTC+8',
    notify: 'email',
    maintenance: false,
  })

  const updateField = (field) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <section className="settings">
      <div className="card">
        <div className="card-title">Workspace settings</div>
        <div className="card-subtitle">
          Update preferences that apply to all teams.
        </div>

        <div className="form-grid">
          <label className="field">
            <span className="field-label">Company name</span>
            <input
              className="input"
              type="text"
              value={form.company}
              onChange={updateField('company')}
            />
          </label>

          <label className="field">
            <span className="field-label">Timezone</span>
            <select
              className="input"
              value={form.timezone}
              onChange={updateField('timezone')}
            >
              <option value="UTC+0">UTC+0</option>
              <option value="UTC+5">UTC+5</option>
              <option value="UTC+8">UTC+8</option>
              <option value="UTC-5">UTC-5</option>
            </select>
          </label>

          <label className="field">
            <span className="field-label">Notifications</span>
            <select
              className="input"
              value={form.notify}
              onChange={updateField('notify')}
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="none">Do not disturb</option>
            </select>
          </label>

          <label className="field toggle-field">
            <span className="field-label">Maintenance window</span>
            <input
              type="checkbox"
              checked={form.maintenance}
              onChange={updateField('maintenance')}
            />
          </label>
        </div>

        <div className="form-actions">
          <button className="ghost-button">Save changes</button>
          <button className="secondary-button">Reset</button>
        </div>
      </div>
    </section>
  )
}

export default Settings
