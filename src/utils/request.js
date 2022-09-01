export async function request(url, params = {}) {
	url = url.split('/')
	if (!url && url.length != 2) {
		return {
			code: 500,
			message: '请输入正确的url'
		}
	}
	return new Promise((resolve, reject) => {
		params.token = uni.getStorageSync('token')
		uniCloud.callFunction({
				name: url[0],
				data: {
					action: url[1],
					params,
				}
			}).then(res => {
				uni.hideLoading()
				let code = res.result.code
				switch (code) {
					case 200:
						resolve(res.result)
						break;
					case 401:
						uni.showToast({
							title: res.result.msg,
							icon: "none"
						})
						setTimeout(() => {
							uni.navigateTo({
								url: '/pages/login/login'
							})
						}, 1500)
						reject(res.result)
						break;
					case 402:
						uni.showToast({
							title: res.result.msg,
							icon: "none",
							mask: true,
							duration: 1000
						})
						setTimeout(() => {
							uni.showLoading({
								title: "正在更新信息..."
							})
							login().then(res => {
								uni.showToast({
									title: "更新信息成功!请重新操作",
									icon: "none"
								})
							})
						}, 1000)
						reject(res.result)
						break;
					default:
						if (code <= 300) {
							resolve(res.result)
						} else {
							reject(res.result)
						}
						break;
				}
			})
			.catch(res => {
				reject(res)
			})

	})

}

export function login() {
	// let token = uni.getStorageSync('token')
	// if (token) return
	return new Promise((resolve, reject) => {
		uni.login({
			success: (result) => {
				uniCloud.callFunction({
						name: 'user',
						data: {
							action: "login",
							params: {
								code: result.code
							}
						}
					}).then(res => {
						console.log(res)
						if (res.result.data) {
							if (res.result.data.token) {
								uni.setStorageSync('token', res.result.data.token)
								uni.setStorageSync('userInfo', res.result.data.userInfo)
							}
						}
						resolve(res)
					})
					.catch(res => {
						reject(res)
					})
			}
		})
	})
}
