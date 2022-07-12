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
				if (res.result.code <= 300) {
					resolve(res.result)
				} else if (res.result.code == 401) {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				} else {
					reject(res.result)
				}
			})
			.catch(res => {
				reject(res)
			})

	})

}

export function login() {
	let token = uni.getStorageSync('token')
	if (token) return
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
