import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
import uView from "uview-ui";
import mixins from 'mixins/mixins.js'
import http from '@/utils/network.js'

Vue.mixin(mixins)
Vue.use(uView);
App.mpType = 'app'
Vue.prototype.$http = new http()

const app = new Vue({
	...App
})
app.$mount()
