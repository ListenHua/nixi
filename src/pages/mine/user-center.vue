<template>
	<view class="page-content">
		<view class="user-info" v-if="userInfo">
			<image class="head" :src="userInfo.avatarUrl" mode="aspectFill"></image>
			<view class="info">
				<view class="name">{{userInfo.nickName}}</view>
				<view class="level">等级：{{userInfo.level}}级</view>
				<view class="auth">身份：{{roleName(userInfo.role)}}</view>
			</view>
		</view>
		<view class="cell-group">
			<u-cell title="修改资料" @click="navigateTo('/pages/mine/edit-info')"></u-cell>
			<u-cell title="提交的考卷" :border="false" @click="viewMyReply"></u-cell>
		</view>
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
					case 99:
						return '管理员'
						break;
				}
			},
			viewMyReply() {
				uni.navigateTo({
					url: '/pages/mine/exam-reply'
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.page-content {
		min-height: 100vh;
		background-color: #f8f8f8;
		padding: 30rpx;

		.user-info {
			display: flex;
			align-items: center;
			background-color: #fff;
			padding: 30rpx;
			box-sizing: border-box;
			margin: 0 auto;
			width: 90%;
			border-radius: 16rpx;

			.head {
				width: 160rpx;
				height: 160rpx;
				border-radius: 50%;
				margin-right: 30rpx;
			}

			.info {
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				height: 140rpx;

				.name {
					font-size: 40rpx;
					font-weight: bold;
					color: #333;
				}

				.level {
					font-size: 28rpx;
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
</style>
