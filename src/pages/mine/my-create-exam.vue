<template>
	<view style="padding-bottom: 50rpx;">
		<view class="paper">
			<view class="paper-block" :class="item.className" v-for="(item,index) in list" :key="item._id"
				@click="navigateTo(`/pages/topic/exam?id=${item._id}&type=view`)">
				<view class="paper-block__title">{{item.title}}</view>
				<image class="paper-block__qrcode" :src="item.qrcode" mode="widthFix"></image>
				<view class="paper-block__date">{{item.createDate}}</view>
			</view>
		</view>
		<view style="padding: 0 50rpx;">
			<u-divider v-if="nodata&&page!=1" text="这是一条底线"></u-divider>
		</view>
		<view v-if="list.length==0&&page!=1" class="nodata-block">
			<image class="icon" src="/static/images/nodata.svg"></image>
			<text class="text">暂无答卷</text>
		</view>
	</view>
</template>

<script>
	import dayjs from 'dayjs'
	export default {
		data() {
			return {
				page: 1,
				list: [],
				nodata: false,
				loading: false
			}
		},
		onReachBottom() {
			if (this.nodata || this.loading) return
			this.getList()
		},
		onLoad() {
			this.getList()
			uni.$off('myExam')
			uni.$on('myExam', () => {
				this.list = []
				this.page = 1
				this.nodata = false
				this.loading = false
				this.getList()
			})
		},
		methods: {
			getList() {
				this.loading = true
				uni.showLoading({
					title: "数据加载中..."
				})
				let params = {
					page: this.page,
					limit: 15,
				}
				this.$http.request('get/myCreateExam', params).then(res => {
					uni.hideLoading()
					this.loading = false
					let list = res.data
					if (list.length == 0) {
						this.nodata = true
						return
					}
					list.map((item, index) => {
						item.createDate = dayjs(item.createTime).format('YYYY-MM-DD HH:ss')
						item.className = 'animation' + (index + 1)
						return item
					})
					this.page += 1
					this.list = [...this.list, ...list]
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
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


			&__title {
				font-size: 32rpx;
				margin-bottom: 20rpx;
				text-overflow: ellipsis;
				overflow: hidden;
				white-space: nowrap;
			}

			&__qrcode {
				width: 100%;
				border-radius: 68rpx;
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
