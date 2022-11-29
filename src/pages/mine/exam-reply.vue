<template>
	<view style="padding-bottom: 50rpx;">
		<view class="paper">
			<view class="paper-block" :class="item.className" v-for="(item,index) in list" :key="item._id"
				@click="navigateTo(`/pages/topic/exam?id=${item._id}&type=answered`)">
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
		<view style="padding: 0 50rpx;">
			<u-divider v-if="nodata&&page!=1" text="这是一条底线"></u-divider>
		</view>
		<n-empty v-if="list.length==0&&page==1&&nodata" text="暂无答卷"></n-empty>
	</view>

</template>

<script>
	import http from '@/utils/network.js'
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				list: [],
				page: 1,
				nodata: false,
				loading: false,
			}
		},
		onLoad() {
			this.$nextTick(() => {
				this.getReply()
			})
			uni.$off('examReply')
			uni.$on('examReply', () => {
				this.list = []
				this.page = 1
				this.nodata = false
				this.loading = false
				this.getReply()
			})
		},
		onReachBottom() {
			if (this.nodata || this.loading) return
			this.getReply()
			uni.vibrateShort()
		},
		methods: {
			// 获取提交的考卷
			getReply() {
				this.loading = true
				uni.showLoading({
					title: "数据加载中..."
				})
				let params = {
					page: this.page,
					limit: 15
				}
				this.$http.request('get/getExamReply', params).then(res => {
					this.loading = false
					uni.hideLoading()
					let list = res.data
					if (list.length == 0) {
						this.nodata = true
						return
					}
					list.map((item, index) => {
						item.className = 'animation' + (index + 1)
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
			width: 200rpx;
			height: 200rpx;
		}

		.text {
			font-size: 28rpx;
			color: $text-color-gray;
			white-space: nowrap;
			margin-top: 30rpx;
		}
	}

	@for $i from 1 to 16 {
		.animation#{$i} {
			animation: fade-in-bottom .8s forwards $i*0.2s;
		}
	}

	.paper {
		padding: 30rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: space-between;

		&-block {
			opacity: 0;
			display: flex;
			flex-direction: column;
			width: 48%;
			height: 440rpx;
			margin-bottom: 40rpx;
			padding: 30rpx 30rpx 10rpx 30rpx;
			box-sizing: border-box;
			position: relative;
			background: linear-gradient(-148deg, transparent 42rpx, #f6f6f6 0);

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
