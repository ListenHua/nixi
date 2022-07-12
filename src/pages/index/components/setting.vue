<template>
	<view :class="['view-content',className]"
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
	</view>
</template>

<script>
	export default {
		name: "setting",
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
				zIndex: 30,
				className: '',
				recommendList: [],
				systemInfo: getApp().globalData.systemInfo,
				isMainPage: false,
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
			// 
			checkPage() {
				let params = this.$handle.className(this.menuShow, this.page, 'setting')
				this.className = params.class
				this.zIndex = params.zIndex
				console.log(params)
			},
			switchInPage() {
				this.$emit("switch", 'setting')
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
