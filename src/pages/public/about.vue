<template>
	<view class="page-content">
		<n-parse :content="content"></n-parse>
	</view>
</template>

<script>
	import nParse from '@/components/n-parse/parse'
	import {
		request
	} from '@/utils/request.js'
	export default {
		components: {
			nParse
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
				request('get/getAbout').then(res => {
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
