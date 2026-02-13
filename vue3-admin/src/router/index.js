import { createRouter, createWebHistory } from 'vue-router'
import { hasRole, isAuthenticated } from '../services/auth'
import Dashboard from '../views/Dashboard.vue'
import Forbidden from '../views/Forbidden.vue'
import Login from '../views/Login.vue'
import Users from '../views/Users.vue'
import Settings from '../views/Settings.vue'
import NotFound from '../views/NotFound.vue'

const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/login',
    component: Login,
    meta: {
      title: 'Login',
      titleKey: 'login',
      public: true,
      layout: 'auth'
    }
  },
  {
    path: '/forbidden',
    component: Forbidden,
    meta: { title: 'Access denied', titleKey: 'forbidden', requiresAuth: true }
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard', titleKey: 'dashboard', requiresAuth: true }
  },
  {
    path: '/users',
    component: Users,
    meta: { title: 'Users', titleKey: 'users', requiresAuth: true }
  },
  {
    path: '/settings',
    component: Settings,
    meta: { title: 'Settings', titleKey: 'settings', requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Not Found', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  if (to.meta?.public) return true
  if (to.meta?.requiresAuth && !isAuthenticated()) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }
  if (to.meta?.roles && !to.meta.roles.some((role) => hasRole(role))) {
    return { path: '/forbidden' }
  }
  return true
})

export default router
