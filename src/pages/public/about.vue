<template>
	<view class="page-content">
		<n-html :content="content"></n-html>
	</view>
</template>

<script>
 	export default {
		data() {
			return {
				content: '',
			}
		},
		mounted() {
			this.getData()
		},
		methods: {
			getData() {
				this.$http.request('get/getAbout').then(res => {
					this.content = res.data
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import url('@/static/scss/animate.scss');
	
	.page-content{
		padding: 40rpx;
	}
	
</style>
