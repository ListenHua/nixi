export default {
	state: {
		userInfo: '',
	},
	mutations: {
		set(state) {
			state.userInfo = uni.getStorageSync('userInfo')
			console.log("store——————>已更新用户信息", state.userInfo);
		},
	},
	actions: {
		setUserInfo({
			commit
		}) {
			commit('set')
		},
		updateUserInfo({
			commit
		}, data) {
			let {
				_this
			} = data
			_this.$http.request('user/getInfo').then(res => {
				uni.setStorageSync('userInfo', res.data)
				commit('set')
			})
		},
	}
}
