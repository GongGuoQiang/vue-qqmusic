// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui';
import  VueResource  from 'vue-resource'
Vue.use(Mint);

import 'mint-ui/lib/style.css';
import './sass/themes/default.scss';
import './sass/index.scss';
import './sass/var.scss';
import Vuex from 'vuex'
import store from './store/index.js'
Vue.use(VueResource);
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el:'#app',
    router,
    store,
    render: h => h(App)
}).$mount('#app')
