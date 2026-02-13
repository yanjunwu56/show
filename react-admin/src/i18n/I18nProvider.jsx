import { createContext, useContext, useMemo, useState } from 'react'

const messages = {
  en: {
    dashboard: 'Dashboard',
    users: 'Users',
    settings: 'Settings',
    login: 'Sign in',
    notifications: 'Notifications',
    shortcuts: 'Shortcuts',
    theme: 'Theme',
    language: 'Language',
    forbidden: 'Access denied',
  },
  de: {
    dashboard: 'Ubersicht',
    users: 'Benutzer',
    settings: 'Einstellungen',
    login: 'Anmelden',
    notifications: 'Hinweise',
    shortcuts: 'Kurzbefehle',
    theme: 'Thema',
    language: 'Sprache',
    forbidden: 'Zugriff verweigert',
  },
}

const I18nContext = createContext(null)

function I18nProvider({ children }) {
  const [locale, setLocale] = useState(
    () => localStorage.getItem('react-admin-locale') || 'en',
  )

  const t = (key) => messages[locale]?.[key] || key

  const updateLocale = (next) => {
    setLocale(next)
    localStorage.setItem('react-admin-locale', next)
  }

  const value = useMemo(
    () => ({ locale, setLocale: updateLocale, t }),
    [locale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

const useI18n = () => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}

export { I18nProvider, useI18n }
