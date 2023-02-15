<template>
	<view class="page-content">
		<view class="step-list">
			<view class="step-block" v-for="(item,index) in versionList" :key="index">
				<view class="step-block__version">{{item.version}}</view>
				<view class="step-block__desc">
					<n-html :content="item.desc"></n-html>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				versionList: [],
				gyroscopeData: {
					x: 0,
					y: 0,
					z: 0
				}
			}
		},
		onLoad() {
			this.getData()
		},
		methods: {
			// 获取数据
			getData() {
				this.$http.request('get/getVersion').then(res => {
					this.versionList = res.data.reverse()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import url('@/static/scss/animate.scss');

	.page-content {
		min-height: 100vh;
	}

	.step-list {
		padding: 0 40rpx 40rpx;

		.step-block {
			padding: 30rpx;
			background-color: #fff;
			border-radius: 16rpx;
			margin-top: 30rpx;
			border-bottom: 2rpx solid #eee;
			opacity: 0;

			@for $i from 1 to 99 {
				&:nth-child(#{$i}) {
					animation: fade-in-right .8s forwards $i*0.1s;
				}
			}

			&__version {
				font-size: 40rpx;
				font-weight: bold;
				color: #000;
			}

			&__content {
				padding: 40rpx
			}
		}
	}
</style>
