<script>
	export default {
		globalData: {
			systemInfo: ''
		},
		onLaunch: function() {
			this.$options.globalData.systemInfo = uni.getSystemInfoSync()
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
