<template>
	<view class="page-content">
		<uni-parse :content="content"></uni-parse>
	</view>
</template>

<script>
	import uniParse from '@/uni_modules/uni-parse/parse'
 	export default {
		components:{
			uniParse
		},
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
