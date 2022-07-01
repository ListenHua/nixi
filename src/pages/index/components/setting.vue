<template>
	<view :class="['view-content',className]"
		:style="{'height':systemInfo.screenHeight+'px','padding-top':systemInfo.statusBarHeight+60+'px','z-index':zIndex}">
		<view v-if="menuShow" class="blur-layer" @touchmove.stop @click="switchInPage"></view>
		<u-cell title="更换背景图" @click="modBackground"></u-cell>
		<u-cell title="移除背景图" @click="deleteBack"></u-cell>
		<u-cell title="清除阅读习惯" @click="clearReadHabit"></u-cell>
		<!-- 提示弹窗 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		name:"setting",
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
			this.checkPage()
		},
		methods: {
			checkPage() {
				let params = this.$handle.className(this.menuShow, this.page, 'setting')
				this.className = params.class
				this.zIndex = params.zIndex
			},
			switchInPage() {
				this.$emit("switch", 'setting')
			},
			// 清除阅读习惯
			clearReadHabit() {
				uni.clearStorageSync("readHabit")
				this.$refs.uToast.show({
					message: '清除成功',
					type: 'success'
				})
			},
			modBackground() {
				let that = this
				uni.chooseImage({
					count: 1,
					success(res) {
						uni.setStorageSync('backgroundImage', res.tempFilePaths[0])
						that.$refs.uToast.show({
							message: '更换成功',
							type: 'success'
						})
						that.$emit("changeBg", res.tempFilePaths[0])
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
								type: 'success'
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
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background-color: $color-white;
		transition: all .5s;
		box-sizing: border-box;
		// padding-left: 60rpx;
		overflow: scroll;
	}
</style>
