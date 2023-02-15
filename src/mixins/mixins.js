import {
	mapState
} from 'vuex'
const systemInfo = {
	filters: {

	},
	data() {
		return {
			system: uni.getSystemInfoSync(),
			statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
			systemInfo: uni.getSystemInfoSync(),
			share: {
				title: '匿习',
				path: 'pages/index/index',
				imageUrl: 'https://mp-54f1765b-5282-47cf-8405-d6f9ccf838c3.cdn.bspapp.com/VKCEYUGU-54f1765b-5282-47cf-8405-d6f9ccf838c3/71473287-ddb9-460e-961c-d9e6e8a574bc.png',
				desc: '学习工具',
				content: '',
			},
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
		})
	},
	onLoad() {},
	onShareTimeline() {
		let params = uni.getStorageSync('shareParams')
		if (params) {
			return {
				title: params.circleTitle,
				desc: params.desc,
				imageUrl: this.share.circleImage,
				content: params.content,
			}
		} else {
			return {
				title: this.share.title,
				desc: this.share.desc,
				content: this.share.content,
			}
		}
	},
	onShareAppMessage() {
		let params = uni.getStorageSync('shareParams')
		let coverList = params.imageUrl
		let coverIndex = Math.floor((Math.random() * coverList.length))
		let cover = coverList[coverIndex]
		if (params) {
			return {
				title: params.title,
				path: params.path,
				imageUrl: cover,
				desc: params.desc,
				content: params.content,
			}
		} else {
			return {
				title: this.share.title,
				path: this.share.path,
				imageUrl: this.share.imageUrl,
				desc: this.share.desc,
				content: this.share.content,
			}
		}

	},
	methods: {
		toast(msg, icon = 'none') {
			uni.showToast({
				title: msg,
				icon,
			})
		},
		navigateTo(url) {
			uni.navigateTo({
				url
			})
		},
		navigaBack(delta) {
			let routes = getCurrentPages()
			if (routes.length <= 1) {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			} else {
				uni.navigateBack({
					delta,
				})
			}
		},
	}
}

export default systemInfo
