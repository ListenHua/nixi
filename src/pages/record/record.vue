<template>
	<view>
		<view class="block" v-for="(item,index) in recordList" @click="viewRecord(item.id)">
			<view class="icon-box">
				<image class="icon" src="/static/images/book-icon.svg"></image>
			</view>
			<image class="cover" :src="item.cover" mode="aspectFill"></image>
			<view class="info">
				<view>
					<view class="title">{{item.title}}</view>
					<view class="author">{{item.author}}</view>
				</view>
				<view class="read">
					<view>
						<text>阅读方式：</text>
						<text class="value">{{item.read_habit=='scroll'?'滚动':'滑动'}}</text>
					</view>
					<view>
						<text>进度：</text>
						<text class="value">{{item.progress*100}}%</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				recordList: [],
			}
		},
		onLoad() {
			let list = uni.getStorageSync("viewRecord")
			// list = JSON.parse(list)
			console.log(list)
			for (let i in list) {
				list[i].progress = list[i].progress.toFixed(2)
				this.recordList.push(list[i])
			}
		},
		methods: {
			viewRecord(id) {
				uni.navigateTo({
					url: "/pages/detail/viewDetail?type=history&id=" + id
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.block {
		width: 88%;
		background-color: #FFFFFF;
		box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
		position: relative;
		margin-top: 40rpx;
		margin-left: 30rpx;
		border-radius: 16rpx;
		display: flex;
		box-sizing: border-box;
		padding: 20rpx;

		.icon-box {
			width: 80rpx;
			height: 80rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 50%;
			position: absolute;
			top: 0;
			bottom: 0;
			right: -40rpx;
			margin: auto 0;
			background-color: $color-white;
			box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);

			.icon {
				width: 40rpx;
				height: 40rpx;
			}
		}

		.cover {
			width: 150rpx;
			height: 200rpx;
			border-radius: 8rpx;
		}

		.info {
			margin-left: 20rpx;
			width: 60%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;

			.title {
				width: 100%;
				font-size: 32rpx;
				font-weight: bold;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
			}

			.author {
				margin-top: 20rpx;
				font-size: 28rpx;
				color: $text-color-gray;
			}

			.read {
				font-size: 28rpx;
				display: flex;
				justify-content: space-between;

				.value {
					font-weight: bold;
				}
			}
		}
	}
</style>
