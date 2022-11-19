<template>
	<view class="page-content">
		<c-navbar title="授权登录" :isPlaceholder="true"></c-navbar>
		<view class="login-content">
			<view class="login-content__auth" v-if="!authInfo">
				<view class="login-content__auth__tip">申请获取以下权限</view>
				<view class="login-content__auth__text">获取你的公开信息 (昵称、头像等)</view>
			</view>
			<!-- <view class="login-content__auth" v-if="authInfo&&!authPhone">
				<view class="login-content__auth__tip">申请获取手机号码</view>
				<view class="login-content__auth__text">用于同步你的学习数据</view>
			</view> -->
			<!-- #ifdef MP-WEIXIN -->
			<!-- 新版本wx.getUserProfile方式登录 -->
			<button v-if="!authInfo" class="login-content__button" @click="getUserInfo">授权登录</button>
			<!-- <button v-if="authInfo&&!authPhone" class="login-content__button" open-type="getPhoneNumber"
				@getphonenumber="decryptPhoneNumber">授权手机号</button> -->
			<!-- #endif -->
		</view>
		<!-- <view class="to__privacy">
			<view class="to__text">登录代表您已同意匿习</view>
			<view class="to__user" @click="navigateToPrivacy">《用户服务协议和隐私政策》</view>
		</view> -->
		<!-- 提示弹窗 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				authInfo: false,
				authPhone: false,
				loginCode: '',
			}
		},
		onLoad() {
			// this.getUserData()
		},
		methods: {
			// 登录用户
			getUserInfo() {
				uni.login({
					success: (res) => {
						this.loginCode = res.code
					}
				})
				let that = this
				uni.getUserProfile({
					desc: "用于使用该小程序用户",
					success: (res) => {
						let params = res.userInfo
						params.code = this.loginCode
						this.$http.request('user/authUserInfo', params).then(result => {
							uni.setStorageSync('token', result.data.token)
							uni.setStorageSync('userInfo', result.data.userInfo)
							that.$refs.uToast.show({
								message: '登录成功!',
								type: 'success'
							})
							that.authInfo = true
							setTimeout(() => {
								uni.$emit('loginSuccess')
								uni.navigateBack({
									delta: 1
								})
							}, 1500)
							// this.getUserData()
						})
					}
				})
			},
			// 查看用户隐私协议
			navigateToPrivacy() {
				this.isCelebration = false
				setTimeout(() => {
					this.isCelebration = true
				}, 500)
			}
		}
	}
</script>

<style scoped lang="scss">
	.page-content {}

	.page-content2 {
		padding: 150rpx;
	}

	.login-content {
		padding: 75rpx;
		padding-bottom: 50rpx;
		text-align: center;

		&__auth {
			padding: 100rpx 0;

			&__tip {
				font-size: 36rpx;
			}

			&__text {
				color: $color-main;
			}
		}

		&__button {
			margin-top: 40rpx;
			background-color: $color-main;
			box-shadow: 0px 1rpx 15rpx 0px rgba(0, 0, 0, 0.1);
			border-radius: 60rpx;
			color: #fff;
		}
	}

	.to__privacy {
		display: flex;
		justify-content: center;
		align-items: center;

		view {
			font-size: 24rpx;
		}

		.to__user {
			color: $color-main;
		}
	}
</style>
