/**
 * Vue3 Main script
 */

// Load vue core
import store from '@/store';
import { createApp } from 'vue';

import auth from './plugins/auth';
import axios from './plugins/axios';
import bus from './plugins/mitt';

import App from '@/App.vue';
import vuetify from '@/plugins/vuetify';
import router from '@/router';

/** Register Vue */
const vue = createApp(App);
vue.use(router);
vue.use(store);
vue.use(vuetify);
vue.use(axios);
vue.use(auth);

// We add a global $mitt property
vue.provide('$bus', bus);

// Run!
router
  .isReady()
  .then(() => vue.mount('#app'))
  .catch(e => console.error(e));

export const useGlobals = (): any => vue.config.globalProperties;
