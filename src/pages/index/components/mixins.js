const mixins = {
	props: {
		menuShow: {
			type: Boolean,
			default: false,
		},
		page: {
			type: Object,
			default: () => {
				main: '';
				minor: ''
			}
		}
	},
	data() {
		return {
			filterShow: false,
			zIndex: 30,
			className: '',
			systemInfo: getApp().globalData.systemInfo,
		}
	},
	mounted() {
		this.checkPage()
	},
	methods: {
		checkPage() {
			let params = this.$handle.className(this.menuShow, this.page, this.$options.name)
			this.className = params.class
			this.zIndex = params.zIndex
		},
		switchInPage() {
			this.$emit("switch", this.$options.name)
		},
		jumpUrl(url) {
			uni.navigateTo({
				url
			})
		}
	}
}
export default mixins