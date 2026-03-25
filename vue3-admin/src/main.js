import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { initTheme } from './services/theme'
import intersect from './directives/intersect'

initTheme()

const app = createApp(App)
// Register a global directive for lazy image loading.
app.directive('intersect', intersect)
app.use(router).mount('#app')
