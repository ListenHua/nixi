const jwt = require("jsonwebtoken"); //webjsontoken
//生成token
function getToken(openid) {
	// sign(加密数据，加密辅助，过期时间(单位/s))
	return jwt.sign({
		openid
	}, appSecret, {
		expiresIn: 60 * 60 * 24 * 30
	});
}
//解密token
function verifyToken(token) {
	return jwt.verify(token, appSecret, (err, decode) => {
		return decode
	})
}

const appId = 'wx5d0911b9fbefb1bf'
const appSecret = '49c120f4657ca772411044f563fcd1ec'

module.exports = {
	getToken,
	verifyToken,
	appId,
	appSecret
}

