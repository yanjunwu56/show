import { computed, ref } from 'vue'

const localeKey = 'vue3-admin-locale'
const locale = ref(localStorage.getItem(localeKey) || 'en')

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
    forbidden: 'Access denied'
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
    forbidden: 'Zugriff verweigert'
  }
}

const t = (key) => messages[locale.value]?.[key] || key

const setLocale = (next) => {
  locale.value = next
  localStorage.setItem(localeKey, next)
}

const currentLocale = computed(() => locale.value)

export { t, setLocale, currentLocale }
