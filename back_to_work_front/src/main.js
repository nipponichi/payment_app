import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css'
import Tooltip from 'primevue/tooltip';
import './style.css'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
      preset: Aura
}}),
app.use('Tooltip', Tooltip);
app.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 5,
    timeout: 1500,
    newestOnTop: true
  })
app.use(router)

app.mount('#app')