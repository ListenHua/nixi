<template>
	<view class="page-content">
		<view class="user-info" v-if="userInfo">
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
			<u-cell title="修改资料" @click="navigateTo('/pages/mine/edit-info')"></u-cell>
			<u-cell :border="false" title="清除阅读习惯" @click="clearReadHabit"></u-cell>
		</view>
		<view class="cell-group">
			<u-cell title="创建的考卷" @click="navigateTo('/pages/mine/my-create-exam')"></u-cell>
			<u-cell title="收到的考卷" :border="false" @click="navigateTo('/pages/mine/exam-reply')"></u-cell>
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
				userInfo: '',
			}
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo')
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

			.head {
				width: 160rpx;
				height: 160rpx;
				margin-right: 30rpx;
				position: relative;

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
				height: 140rpx;

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
</style>
