import Vue from 'vue'
import App from './App'
Vue.config.productionTip = false
import uView from "uview-ui";
import utils from "utils/index.js"
import mixins from 'mixins/mixins.js'

Vue.mixin(mixins)
Vue.use(uView);
App.mpType = 'app'
Vue.prototype.$handle = utils

const app = new Vue({
    ...App
})
app.$mount()
