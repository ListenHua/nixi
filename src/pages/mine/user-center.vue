<template>
	<view class="page-content">
		<view class="user-info" v-if="userInfo">
			<image class="bg-img" :src="userInfo.background" mode="aspectFill"></image>
			<view class="head" @click="navigateTo('/pages/mine/edit-info')">
				<image class="head-avatar" :src="userInfo.avatarUrl" mode="aspectFill"></image>
				<view class="head-level">{{userInfo.level}}</view>
			</view>
			<view class="info" @click="navigateTo('/pages/mine/edit-info')">
				<view class="name">{{userInfo.nickName}}</view>
				<view class="id">ID：{{userInfo.id}}</view>
			</view>
		</view>
		<view class="cell-group">
			<u-cell title="创建的试卷" @click="navigateTo('/pages/mine/my-create-exam')"></u-cell>
			<u-cell title="收到的试卷" @click="navigateTo('/pages/mine/exam-reply')"></u-cell>
			<u-cell title="模拟面试记录" :border="false" @click="navigateTo('/pages/mine/my-simulation')"></u-cell>
			<!-- <u-cell title="系统通知" :border="false" @click="navigateTo()"></u-cell> -->
		</view>
		<view class="cell-group">
			<u-cell title="版本描述" @click="navigateTo('/pages/public/version')"></u-cell>
			<u-cell title="关于我们" @click="navigateTo('/pages/public/about')"></u-cell>
			<u-cell :border="false">
				<view slot="title" class="cell-text">
					<text>联系客服</text>
					<button open-type="contact"></button>
				</view>
			</u-cell>
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
		data() {
			return {

			}
		},
		methods: {
			// 清除阅读习惯
			clearReadHabit() {
				uni.clearStorageSync("readHabit")
				this.$refs.uToast.show({
					message: '清除成功',
					type: 'success',
					duration: 1500,
				})
			},

		}
	}
</script>

<style scoped lang="scss">
	.page-content {
		min-height: 100vh;
		background-color: #f8f8f8;

		.user-info {
			display: flex;
			flex-direction: column;
			align-items: center;
			background-color: #fff;
			padding: 30rpx;
			box-sizing: border-box;
			width: 100%;
			border-radius: 16rpx;
			position: relative;

			.bg-img {
				position: absolute;
				z-index: 1;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				filter: blur(2px) opacity(0.3);
				background-color: #fff;
			}

			.head {
				width: 160rpx;
				height: 160rpx;
				margin-right: 30rpx;
				position: relative;
				z-index: 5;

				&-avatar {
					width: 160rpx;
					height: 160rpx;
					border-radius: 50%;
				}

				&-level {
					width: 48rpx;
					height: 48rpx;
					background-color: $color-main;
					color: #fff;
					line-height: 48rpx;
					font-weight: bold;
					font-size: 24rpx;
					position: absolute;
					border-radius: 50%;
					text-align: center;
					right: 0;
					bottom: 0;
				}
			}

			.info {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 140rpx;
				position: relative;
				z-index: 5;

				.name {
					font-size: 48rpx;
					font-weight: bold;
					color: #333;
				}

				.id {
					font-size: 32rpx;
				}

				.auth {
					font-size: 28rpx;
				}
			}
		}

		.cell-group {
			width: 90%;
			background-color: #fff;
			margin: 30rpx auto;
			padding: 20rpx 40rpx;
			border-radius: 16rpx;
			box-sizing: border-box;
		}
	}

	.desc-text {
		margin-top: 50rpx;
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

	.cell-text {
		position: relative;

		button {
			position: absolute;
			width: 100%;
			height: 100%;
			top: 0;
			left: 0;
			opacity: 0;
			z-index: 1;
		}
	}
</style>
