export default {
	state: {
		menuShow: false,
		page: {
			main: 'main',
			minor: ''
		}
	},
	mutations: {
		checkPage(state, page) {
			state.page = page
		},
		changeMenuShow(state) {
			state.menuShow = !state.menuShow
		},
	},
	actions: {

	}
}
