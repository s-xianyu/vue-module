import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import './utils/fontSize'
import './style/common.css'
import *as echarts from 'echarts'

import { getStore } from "./utils/utils";

Vue.prototype.$echarts = echarts


// import Raven from 'raven-js';
// import RavenVue from 'raven-js/plugins/vue';

Vue.config.productionTip = false

// if (process.env.NODE_ENV !== 'development') {
//   // sentry集成
//   Raven.config(`https://${ process.env.VUE_APP_SENTRYCODE }@sentry3.weifengqi18.com/${ process.env.VUE_APP_SENTRYID }`, {
//     release: process.env.VUE_APP_SERVE || 'dev'
//   }).addPlugin(RavenVue, Vue)
//     .install();
// }

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
