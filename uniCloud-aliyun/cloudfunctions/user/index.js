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
};
authUserInfo(){
	
},