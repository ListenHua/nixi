<template>
	<scroll-view scroll-y :class="['view-content',className]"
		:style="{'height':systemInfo.screenHeight+'px','padding-top':systemInfo.statusBarHeight+60+'px','z-index':zIndex}">
		<view v-if="menuShow" class="blur-layer" @touchmove.stop @click="switchInPage"></view>
		<n-empty v-if="recordList.length==0" text="暂无浏览记录"></n-empty>
		<view class="block" v-for="(item,index) in recordList" @click="viewRecord(item.id)">
			<image class="cover" :src="item.cover" mode="aspectFill"></image>
			<view class="info">
				<view>
					<view class="title">{{item.title}}</view>
				</view>
				<view class="read">
					<text>上次浏览至：</text>
					<text class="value">{{item.progress_title}}</text>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import mixin from './mixins.js'
	export default {
		name: "record",
		mixins: [mixin],
		data() {
			return {
				recordList: [],
			}
		},
		methods: {
			refresh() {
				console.log("刷新浏览记录");
				this.recordList = []
				let list = uni.getStorageSync("viewRecord")
				for (let i in list) {
					list[i].progress = (list[i].progress * 100).toFixed(2)
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
	@import url('../css/main.css');

	.view-content {

		.block {
			width: 90%;
			background-color: #FFFFFF;
			position: relative;
			margin: 0 auto;
			display: flex;
			box-sizing: border-box;
			padding: 30rpx 0;
			border-bottom: 2rpx solid #f0f0f0;

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

				.title {
					width: 100%;
					font-size: 36rpx;
					font-weight: bold;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.read {
					margin-top: 16rpx;
					font-size: 30rpx;
					color: #999;
					display: flex;
					flex-direction: column;

					.value {
						margin-top: 8rpx;
						color: #000;
						display: -webkit-box;
						-webkit-line-clamp: 2;
						-webkit-box-orient: vertical;
						overflow: hidden;
						text-overflow: ellipsis;
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
