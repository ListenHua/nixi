<template>
	<view>
		<view class="paper">
			<view class="paper-block" v-for="(item,index) in list" :key="item._id" @click="navigateTo(`/pages/topic/exam?id=${item._id}&type=answered`)">
				<view class="one"></view>
				<view class="paper-block__info">
					<image :src="item.answerer.avatarUrl" mode="aspectFill"></image>
					<text>{{item.answerer.nickName}}</text>
				</view>
				<view class="paper-block__title">{{item.info.title}}</view>
				<view class="paper-block__content">
					<view class="text" v-for="num in item.topic">
						<view class="line" v-for="line in 3"></view>
					</view>
				</view>
				<view class="paper-block__date">{{item.answerTime}}</view>
			</view>
		</view>
		<view v-if="list.length==0&&page!=1" class="nodata-block">
			<image class="icon" src="/static/images/nodata.svg"></image>
			<text class="text">未搜索到相关内容</text>
		</view>
	</view>

</template>

<script>
	import http from '@/utils/network.js'
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				list: [],
				page: 1
			}
		},
		onLoad() {
			this.$nextTick(() => {
				this.getReply()
			})
		},
		methods: {
			// 获取提交的考卷
			getReply() {
				let params = {
					page: this.page,
					size: 15
				}
				console.log(this);
				this.$http.request('get/getExamReply', params).then(res => {
					let list = res.data
					list.map(item => {
						item.answerTime = dayjs(item.createTime).format('YYYY-MM-DD HH:ss')
						return item
					})
					this.page += 1
					this.list = [...this.list, ...list]
				})
			},

		}
	}
</script>

<style scoped lang="scss">
	.nodata-block {
		padding: 50rpx;
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;

		.icon {
			width: 100rpx;
			height: 100rpx;
		}

		.text {
			font-size: 28rpx;
			color: $text-color-gray;
			white-space: nowrap;
		}
	}

	.paper {
		padding: 30rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: space-between;

		&-block {
			display: flex;
			flex-direction: column;
			width: 48%;
			height: 440rpx;
			margin-bottom: 40rpx;
			padding: 30rpx 30rpx 10rpx 30rpx;
			box-sizing: border-box;
			position: relative;
			background: linear-gradient(-150deg, transparent 40rpx, #f6f6f6 0);

			&::before {
				content: '';
				position: absolute;
				top: 0;
				right: 0;
				background: linear-gradient(to left bottom, transparent 50%, rgba(0, 0, 0, .2) 0, rgba(0, 0, 0, .4)) 100% 0 no-repeat;
				width: 40rpx;
				height: 80rpx;
				transform: translateY(-30rpx) rotate(-30deg);
				transform-origin: bottom right;
				border-bottom-left-radius: inherit;
				box-shadow: -8rpx 8rpx 12rpx -4rpx rgba(0, 0, 0, .2);
			}

			&__info {
				display: flex;
				align-items: center;

				image {
					width: 60rpx;
					height: 60rpx;
					border-radius: 50%;
				}

				text {
					font-size: 24rpx;
					color: #333;
					margin-left: 10rpx;
				}
			}

			&__title {
				font-size: 28rpx;
				margin-top: 20rpx;
			}

			&__content {
				flex: 1;
				overflow: scroll;
				padding-top: 30rpx;

				.text {
					display: flex;
					flex-direction: column;
					position: relative;

					&::after {
						content: "";
						position: absolute;
						width: 10rpx;
						height: 10rpx;
						border-radius: 50%;
						background-color: #333;
						left: 0;
						top: -4rpx;
					}

					.line {
						width: 100%;
						height: 6rpx;
						margin-bottom: 24rpx;
						background-color: #333;
						margin-left: 30rpx;
					}
				}
			}

			&__date {
				width: 100%;
				font-size: 24rpx;
				text-align: end;
				color: #999;
				margin-top: 20rpx;
			}
		}
	}
</style>
