import Vuex from 'vuex'
import Vue from 'vue'
Vue.use(Vuex);
import user from '@/store/modules/user'
const store = new Vuex.Store({
	modules: {
		user,
	},
	state: {
		
	}
})

export default store
