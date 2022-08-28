<template>
	<scroll-view scroll-y :class="['view-content',className]"
		:style="{'height':systemInfo.screenHeight+'px','padding-top':systemInfo.statusBarHeight+60+'px','z-index':zIndex}">
		<view v-if="menuShow" class="blur-layer" @touchmove.stop @click="switchInPage"></view>
		<view class="cell-group">
			<u-cell title="更换背景图" @click="modBackground"></u-cell>
			<u-cell title="移除背景图" @click="deleteBack"></u-cell>
			<u-cell :border="false" title="清除阅读习惯" @click="clearReadHabit"></u-cell>
		</view>
		<view class="cell-group">
			<u-cell title="版本描述" @click="jumpUrl('/pages/public/version')"></u-cell>
			<u-cell :border="false" title="关于我们" @click="jumpUrl('/pages/public/about')"></u-cell>
		</view>
		<view class="desc-text">
			<image src="/static/images/logo.png"></image>
			<text>Nixi Studio</text>
		</view>
		<!-- 提示弹窗 -->
		<u-toast ref="uToast" />
	</scroll-view>
</template>

<script>
	import mixin from './mixins.js'
	export default {
		name: "setting",
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
			console.log("加载setting")
			this.checkPage()
		},
		methods: {
			// 页面跳转
			jumpUrl(url) {
				uni.navigateTo({
					url
				})
			},
			// 清除阅读习惯
			clearReadHabit() {
				uni.clearStorageSync("readHabit")
				this.$refs.uToast.show({
					message: '清除成功',
					type: 'success',
					duration: 1500,
				})
			},

			// 上传图片
			modBackground() {
				uni.chooseImage({
					sizeType: ["compressed "],
					count: 1,
					success: (res) => {
						let filePath = res.tempFilePaths[0]
						let fileName = filePath.substring(filePath.lastIndexOf('/'), filePath.length)
						uniCloud.uploadFile({
							cloudPath: fileName,
							filePath,
						}).then(res => {
							uni.setStorageSync('backgroundImage', res.fileID)
							this.$refs.uToast.show({
								message: '更换成功',
								type: 'success',
								duration: 1500,
							})
							this.$emit("changeBg", res.fileID)
						})
					}
				})
			},
			deleteBack() {
				let that = this
				uni.showModal({
					title: "提示",
					content: "是否要删除当前背景图?",
					success(res) {
						if (res.confirm) {
							uni.removeStorageSync('backgroundImage')
							that.$refs.uToast.show({
								message: '移除成功',
								type: 'success',
								duration: 1500,
							})
							that.$emit("changeBg", '')
						}
					}
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
