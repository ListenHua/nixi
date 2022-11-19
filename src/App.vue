<script>
	export default {
		globalData: {
			systemInfo: ''
		},
		onLaunch: function() {
			this.$options.globalData.systemInfo = uni.getSystemInfoSync()
			this.$http.request('get/systemData', {
				type: 'share'
			}).then(res => {
				let data = res.data
				uni.setStorageSync('shareParams', data)
			})
			this.$http.request('get/systemData', {
				type: 'share-cover'
			}).then(res => {
				let data = res.data
				uni.setStorageSync('shareCover', data)
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
	@import "@/static/scss/index.scss";
	@import '@/static/scss/animate.scss';
</style>
