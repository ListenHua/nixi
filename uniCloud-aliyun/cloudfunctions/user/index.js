'use strict';
const appid = 'wx5d0911b9fbefb1bf'
const secret = '49c120f4657ca772411044f563fcd1ec'
exports.main = async (event, context) => {
	switch (event.action) {
		case 'authUserInfo': {
			return authUserInfo(event.params)
		}
		default: {
			return
		}
	}
}

async function authUserInfo(event) {
	const {
		code,
		avatarUrl,
		gender,
		nickName
	} = event
	const URL =
		`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
	const requestOptions = {
		method: 'GET',
		dataType: 'json'
	}
	const res = await uniCloud.httpclient.request(URL, requestOptions)
	return res
}
