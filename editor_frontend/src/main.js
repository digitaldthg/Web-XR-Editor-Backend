import Vue from 'vue'
import App from './App.vue'
import {store} from './store'
import router from './router'
import VueMarkdown from 'vue-markdown';

Vue.config.productionTip = false;

Vue.component('vue-markdown', VueMarkdown);

const app = new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
}).$mount('#app')
