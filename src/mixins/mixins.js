import {
	login
} from '@/utils/request'
const systemInfo = {
	filters: {

	},
	data() {
		return {
			system: uni.getSystemInfoSync(),
			statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
			share: {
				title: '匿习',
				path: 'pages/index/index',
				imageUrl: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-54f1765b-5282-47cf-8405-d6f9ccf838c3/71473287-ddb9-460e-961c-d9e6e8a574bc.png',
				desc: '学习工具',
				content: '',
			},
			userInfo: '',
		}
	},
	onShow() {
		this.userInfo = uni.getStorageSync('userInfo')
	},
	onLoad() {
		uni.$off('refreshUserInfo')
		uni.$on('refreshUserInfo', async () => {
			await login()
			this.userInfo = uni.getStorageSync('userInfo')
			console.log("刷新用户信息");
		})
	},
	// onShareTimeline() {
	// 	return {
	// 		title: this.share.title,
	// 		path: this.share.path + '?sid=' + this.share.sid,
	// 		imageUrl: this.share.imageUrl,
	// 		desc: this.share.desc,
	// 		content: this.share.content,
	// 		success() {
	// 			uni.showToast({
	// 				title: '分享成功',
	// 			})
	// 		},
	// 		fail() {
	// 			uni.showToast({
	// 				title: '分享失败',
	// 				icon: 'none',
	// 			})
	// 		},
	// 	}
	// },
	onShareAppMessage() {
		return {
			title: this.share.title,
			path: this.share.path,
			imageUrl: this.share.imageUrl,
			desc: this.share.desc,
			content: this.share.content,
			success() {
				uni.showToast({
					title: '分享成功',
				})
			},
			fail() {
				uni.showToast({
					title: '分享失败',
					icon: 'none',
				})
			},
		}
	},
	methods: {

	}
}

export default systemInfo
