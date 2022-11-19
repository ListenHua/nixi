<template>
	<scroll-view scroll-y :class="['view-content',className]"
		:style="{'height':systemInfo.screenHeight+'px','padding-top':systemInfo.statusBarHeight+60+'px','z-index':zIndex}">
		<view v-if="menuShow" class="blur-layer" @touchmove.stop @click="switchInPage"></view>
		<!-- <view class="cell-group">
			<u-cell title="提交的考卷" :border="false" @click="viewMyReply"></u-cell>
		</view> -->
		<u-empty mode="data" text="暂无新功能可以体验" icon="http://cdn.uviewui.com/uview/empty/data.png">
		</u-empty>
		<view class="desc-text">
			<image src="/static/images/logo.png"></image>
			<text>Nixi Test</text>
		</view>
		<!-- 提示弹窗 -->
		<u-toast ref="uToast" />
	</scroll-view>
</template>

<script>
	import mixin from './mixins.js'
	export default {
		name: "test",
		mixins: [mixin],
		data() {
			return {

			}
		},
		watch: {
			menuShow(result) {
				this.checkPage()
			},
		},
		mounted() {
			console.log("加载test")
			this.checkPage()
		},
		methods: {
			viewMyReply() {
				uni.navigateTo({
					url: '/pages/mine/exam-reply'
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	@import url('main.css');

	.view-content {
		background-color: #f8f8f8;

		.cell-group {
			width: 90%;
			background-color: #fff;
			margin: 30rpx auto;
			padding: 20rpx 40rpx;
			border-radius: 16rpx;
			box-sizing: border-box;
		}

		.desc-text {
			position: absolute;
			bottom: 40rpx;
			left: 0;
			right: 0;
			margin: 0 auto;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
			}

			text {
				margin-left: 30rpx;
				font-size: 28rpx;
				color: #333;
				font-weight: bold;
			}
		}
	}
</style>
