import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex);
import user from '@/store/modules/user'
import home from '@/store/modules/home'
const store = new Vuex.Store({
	modules: {
		user,
		home
	},
	state: {

	}
})

export default store
