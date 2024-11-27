import { createApp } from 'vue'
//import axios from 'axios';

import App from './App.vue'
import router from './router/index.js'
import LoginStore from '@/features/auth/store/auth.js';
import axios from '@/axios/axios.js';

// Attach Axios globally

const app = createApp(App);

app.config.globalProperties.$axios = axios;
app.use(router);
app.use(LoginStore);
app.mount('#app');
