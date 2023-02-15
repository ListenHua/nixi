export default {
	state: {
		zIndex: 30,
		className: '',
		menuShow: false,
		page: {
			main: 'main',
			minor: ''
		}
	},
	mutations: {
		checkPage(state) {
			let menu = state.menuShow
			let page = state.page
			let name = page.main
			let obj = {
				class: "",
				zIndex: 30,
			}
			if (menu) {
				if (page.main == name) {
					state.className = 'scale-page'
					state.zIndex = 50
				} else if (page.minor == name) {
					state.className = 'scale-page-minor'
					state.zIndex = 40
				} else {
					state.className = 'hide-page'
				}
			} else {
				if (page.main == name) {
					state.className = ''
					state.zIndex = 50
				} else if (page.minor == name) {
					state.className = ''
					state.zIndex = 40
				} else {
					state.className = 'hide-page'
				}
			}
			return obj
		}
	},
	actions: {

	}
}
