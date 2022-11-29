<template>
	<view class="page-content">
		<view class="">
			<u-cell :border='false' :customStyle="titleStyle" @click="choseHead">
				<view slot="title">
					<text class="u-cell-text">头像</text>
				</view>
				<view slot="value">
					<image class="u-cell-head" :src="userInfo.avatarUrl" mode="aspectFill"></image>
				</view>
			</u-cell>

			<u-cell :border='false' :isLink="true" :customStyle="titleStyle" :value="userInfo.nickName"
				@click="modNamePop=true">
				<view slot="title">
					<text class="u-cell-text">用户昵称</text>
				</view>
			</u-cell>

			<u-cell :border='false' :customStyle="titleStyle">
				<view slot="title">
					<text class="u-cell-text">背景图</text>
				</view>
				<view slot="value">
					<view class="u-cell-bg" v-if="userInfo.background">
						<image class="cover" :src="userInfo.background" mode="aspectFill" @click="modBackground">
						</image>
						<image class="delete" src="/static/images/delete-icon1.png" mode="aspectFill"
							@click="deleteBack"></image>
					</view>
					<view v-else class="u-cell-add" @click="modBackground">
						<image src="/static/images/add.png" mode="aspectFill"></image>
					</view>
				</view>
			</u-cell>


			<u-cell :border='false' :customStyle="titleStyle" :value="roleName(userInfo.role)">
				<view slot="title">
					<text class="u-cell-text">身份</text>
				</view>
			</u-cell>
		</view>
		<u-popup :show="modNamePop" mode="center" round="20" @close="modNamePop=false">
			<view class="modify-pop">
				<view class="title">修改昵称</view>
				<input type="text" v-model="modifyNameText" maxlength="8" placeholder="请输入昵称(3-8字)">
				<view class="button-box">
					<u-button color="#3478F5" size="small" text="确认修改" @click="modifyName"></u-button>
				</view>
			</view>
		</u-popup>
		<!-- 提示弹窗 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo: '',
				titleStyle: {
					fontSize: '28rpx',
					color: "#000",
					padding: "20rpx 0",
					borderBottom: "2rpx solid #eee"
				},
				modNamePop: false,
				modifyNameText: '',
			}
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo')
		},
		methods: {
			roleName(role) {
				switch (role) {
					case 0:
						return '普通用户'
						break;
					case 1:
						return '优先体验者'
						break;
					case 2:
						return '股东'
						break;
					case 9:
						return '管理员'
						break;
					default:
						return 'VIP'
						break;
				}
			},
			choseHead() {
				uni.chooseImage({
					sizeType: ["compressed"],
					count: 1,
					success: (res) => {
						console.log(res);
						if (res.tempFiles[0].size > 1048576) {
							uni.showToast({
								title: "暂不支持上传大于1M的图片",
								icon: "none"
							})
							return
						}
						let filePath = res.tempFilePaths[0]
						let fileName = this.userInfo.id + filePath.substring(filePath.lastIndexOf('/'),
							filePath.length)
						uniCloud.uploadFile({
							cloudPath: fileName,
							filePath,
						}).then(res => {
							this.$http.request('user/update', {
								avatarUrl: res.fileID
							}).then(() => {
								this.$refs.uToast.show({
									message: '修改成功',
									type: 'success',
									duration: 1500,
								})
								this.getInfo()
								uni.$emit("refreshUserInfo")
							})
						})
					}
				})
			},
			// 获取用信息
			getInfo() {
				this.$http.request('user/getInfo').then(res => {
					this.userInfo = res.data
					uni.setStorageSync('userInfo', res.data)
				})
			},
			// 修改昵称
			modifyName() {
				if (this.modifyNameText.length < 3) {
					this.toast('昵称至少需要三个字')
					return
				}
				let params = {
					nickName: this.modifyNameText
				}
				this.$http.request('user/update', params).then(res => {
					this.$refs.uToast.show({
						message: '修改成功',
						type: 'success',
						duration: 1500,
					})
					uni.$emit("refreshUserInfo")
					this.getInfo()
					this.modNamePop = false
					this.modifyNameText = ''
				})
			},
			// 更换背景图
			modBackground() {
				uni.chooseImage({
					sizeType: ["compressed"],
					count: 1,
					success: (res) => {
						console.log(res);
						if (res.tempFiles[0].size > 1048576) {
							uni.showToast({
								title: "暂不支持上传大于1M的图片",
								icon: "none"
							})
							return
						}
						let filePath = res.tempFilePaths[0]
						let fileName = filePath.substring(filePath.lastIndexOf('/'), filePath.length)
						uniCloud.uploadFile({
							cloudPath: fileName,
							filePath,
						}).then(res => {
							this.$http.request('user/update', {
								background: res.fileID
							}).then(() => {
								this.$refs.uToast.show({
									message: '修改成功',
									type: 'success',
									duration: 1500,
								})
								this.getInfo()
								uni.$emit("refreshUserInfo")
							})
						})
					}
				})
			},
			deleteBack() {
				uni.showModal({
					title: "提示",
					content: "是否要删除当前背景图?",
					success: (res) => {
						if (res.confirm) {
							this.$http.request('user/update', {
								background: ''
							}).then(res => {
								this.$refs.uToast.show({
									message: '移除成功',
									type: 'success',
									duration: 1500,
								})
								this.getInfo()
								uni.$emit("refreshUserInfo")
							})

						}
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.modify-pop {
		width: 600rpx;
		background-color: #fff;
		padding: 30rpx;
		border-radius: 20rpx;
		box-sizing: border-box;

		.title {
			font-size: 32rpx;
			color: #333;
			text-align: center;
		}

		input {
			font-size: 28rpx;
			color: #333;
			padding: 30rpx;
			margin: 40rpx 0;
		}

		.button-box {
			width: 160rpx;
			margin: 0 auto;
		}
	}

	.page-content {
		padding: 40rpx;
	}

	.u-cell-head {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}

	.u-cell-bg {
		width: 100rpx;
		height: 100rpx;
		position: relative;

		.cover {
			width: 100%;
			height: 100%;
			border-radius: 50%;
		}

		.delete {
			width: 40rpx;
			height: 40rpx;
			position: absolute;
			right: -10rpx;
			top: -10rpx;
		}
	}

	.u-cell-add {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #ddd;

		image {
			width: 40rpx;
			height: 40rpx;
		}
	}

	.u-cell-text {
		font-size: 32rpx;
		position: relative;
		font-weight: bold;
	}
</style>
