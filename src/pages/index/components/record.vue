<template>
	<scroll-view scroll-y :class="['view-content',className]"
		:style="{'height':systemInfo.screenHeight+'px','padding-top':systemInfo.statusBarHeight+60+'px','z-index':zIndex}">
		<view v-if="menuShow" class="blur-layer" @touchmove.stop @click="switchInPage"></view>
		<n-empty v-if="recordList.length==0" text="暂无浏览记录"></n-empty>
		<view class="block" v-for="(item,index) in recordList" @click="viewRecord(item.id)">
			<!-- <view class="icon-box">
				<image class="icon" src="/static/images/book-icon.svg"></image>
			</view> -->
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
						<text class="value">{{item.progress}}%</text>
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import mixin from './mixins.js'
	export default {
		name:"record",
		mixins:[mixin],
		data() {
			return {
				recordList: [],
			}
		},
		watch: {
			menuShow(result) {
				this.checkPage()
			},
		},
		mounted() {
			console.log("加载record")
			this.checkPage()
		},
		methods: {
			refresh() {
				console.log("刷新浏览记录");
				this.recordList = []
				let list = uni.getStorageSync("viewRecord")
				for (let i in list) {
					list[i].progress = (list[i].progress*100).toFixed(2)
					this.recordList.push(list[i])
				}
			},
			viewRecord(id) {
				uni.navigateTo({
					url: "/pages/detail/viewDetail?type=history&id=" + id
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	@import url('main.css');
	.view-content {

		.block {
			width: 90%;
			background-color: #FFFFFF;
			box-shadow: 0 0 20px -4px rgba(0, 0, 0, 0.2);
			position: relative;
			margin: 40rpx auto;
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
				flex-shrink: 0;
			}

			.info {
				margin-left: 20rpx;
				width: 70%;
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
	}

	.placeholder-block {
		height: 500rpx;
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
			margin-top: 30rpx;
			font-size: 28rpx;
			color: $text-color-gray;
			white-space: nowrap;
		}
	}
</style>
