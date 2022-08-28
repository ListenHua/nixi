'use strict';
const db = uniCloud.database()
const {
	verifyToken
} = require("wx-common");
exports.main = async (event, context) => {
	switch (event.action) {
		case 'addBookInfo': {
			return addBookInfo(event.params)
		}
		case 'addTopic': {
			return addTopic(event.params)
		}
		case 'addVersion': {
			return addVersion(event.params)
		}
		case 'addLabel': {
			return addLabel(event.params)
		}
		case 'createSubject': {
			return createSubject(event.params)
		}
		default: {
			return
		}
	}
};

async function createSubject(event) {
	let {
		title,
		topic,
		token,
		number,
		limitTime,
		endTime,
	} = event
	// 验证参数
	if (event.topic.length <= 0) {
		return {
			code: 400,
			msg: "请选择相应的题目",
		}
	} else if (!event.title) {
		return {
			code: 400,
			msg: "请输入试卷标题"
		}
	} else if (!event.token) {
		return {
			code: 401,
			msg: "请先授权登录用户"
		}
	}
	let userInfo = verifyToken(event.token)
	let time = new Date().getTime()
	const collection = db.collection('testPaper')
	let res = await collection.add({
		title,
		topic,
		token,
		number,
		limitTime,
		endTime,
		createTime: time,
		creator: userInfo.userInfo,
		qrcode: '',
	})
	console.log('exam-------->', res);

	let qrcode = await uniCloud.callFunction({
		name: "public",
		data: {
			action: "qrcode",
			params: {
				path: "pages/topic/exam",
				scene: res.id
			}
		}
	})
	console.log('qrcode-------->', qrcode);
	await collection.doc(res.id).update({
		qrcode: qrcode.result
	})

	return {
		code: 200,
		msg: "生成成功!",
		data: {
			shareImg: qrcode.result,
			id: res.id
		}
	}
}

async function addLabel(event) {
	let {
		name,
	} = event
	const collection = db.collection('labelList')
	let res = await collection.add({
		name
	})
	return {
		code: 200,
		message: '新增成功!',
	}
}

async function addVersion(event) {
	let {
		version,
		desc,
	} = event
	const collection = db.collection('version')
	let res = await collection.add({
		version,
		versionNum: version.replace(/./g, ""),
		desc,
	})
	return {
		code: 200,
		message: '新增成功!',
	}
}

async function addTopic(event) {
	let {
		title,
		type,
		label,
		option,
		answer,
		level,
		creater,
	} = event
	const collection = db.collection('topicList')
	let res = await collection.add({
		title,
		type,
		label: label.split(','),
		option,
		answer,
		creater,
		level,
	})
	return {
		code: 200,
		message: '新增成功!',
	}
}

async function addBookInfo(event) {
	let {
		cover,
		author,
		creater,
		title,
		type,
		origin,
	} = event
	const collection = db.collection('bookList')
	let res = await collection.add({
		cover,
		author,
		creater,
		title,
		type,
		origin,
		list: []
	})
	console.log(JSON.stringify(res))
	return {
		code: 200,
		message: '新增成功!',
	}
}
