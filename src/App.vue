<script>
	export default {
		globalData: {
			systemInfo: ''
		},
		onLaunch: function() {
			this.$options.globalData.systemInfo = uni.getSystemInfoSync()
			uni.login({
				success: (res) => {
					uniCloud.callFunction({
						name: 'user',
						data: {
							action: "authUserInfo",
							params:{
								code:res.code
							}
						}
					}).then(res => {
						console.log(res);
					})
				}
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
</style>
