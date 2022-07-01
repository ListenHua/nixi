<template>
	<scroll-view scroll-y :class="['view-content',className]"
		:style="{'height':systemInfo.screenHeight+'px','padding-top':systemInfo.statusBarHeight+50+'px','z-index':zIndex}"
		@scroll="pageScroll">
		<view v-if="menuShow" class="blur-layer" @touchmove.stop @click="switchInPage"></view>
		<view :class="['search-box',scrollTop>10?'search-to-top':'']" :style="{top:systemInfo.statusBarHeight+60+'px'}"
			@click="toSearch">
			<u-icon class="icon" name="search"></u-icon>
			<input class="input" disabled />
		</view>
		<view class="block-list">
			<view class="block" v-for="(item,index) in recommendList" :key="index" @click="viewPage(item.id)">
				<image class="cover" :src="item.cover" mode="aspectFill"></image>
				<view class="title">{{item.title}}</view>
				<view class="author">{{item.author}}</view>
			</view>
		</view>
		<!-- <view class="card-list" style="padding-top: 100rpx;">
			<view class="nav-title">推荐</view>
			<scroll-view scroll-x>
				<view class="block-list">
					<view class="block" v-for="(item,index) in recommendList" :key="index" @click="viewPage(item.id)">
						<image class="cover" :src="item.cover" mode="aspectFill"></image>
						<view class="title">{{item.title}}</view>
						<view class="author">{{item.author}}</view>
					</view>
					<view v-if="recommendList.length>5" class="placeholder-block">
						<image class="icon" src="/static/images/nodata.svg"></image>
						<text class="text">没有更多了</text>
					</view>
				</view>
			</scroll-view>
		</view> -->
		<!-- <view class="card-list">
			<view class="nav-title">资料库</view>
			<scroll-view scroll-x>
				<view class="block-list">
					<view class="block" v-for="(item,index) in recommendList" :key="item.id" @click="viewPage(item.id)">
						<image class="cover" :src="item.cover" mode="aspectFill"></image>
						<view class="title">{{item.title}}</view>
						<view class="author">{{item.author}}</view>
					</view>
					<view v-if="recommendList.length>5" class="placeholder-block">
						<image class="icon" src="/static/images/nodata.svg"></image>
						<text class="text">没有更多了</text>
					</view>
				</view>
			</scroll-view>
		</view> -->
		<!-- <view class="card-list">
			<view class="nav-title">面试题</view>
			<scroll-view scroll-x>
				<view class="block-list">
					<view class="block" v-for="(item,index) in recommendList" :key="item._id"
						@click="viewPage(item.id)">
						<image class="cover" :src="item.cover" mode="aspectFill"></image>
						<view class="title">{{item.title}}</view>
						<view class="author">{{item.author}}</view>
					</view>
					<view v-if="recommendList.length>5" class="placeholder-block">
						<image class="icon" src="/static/images/nodata.svg"></image>
						<text class="text">没有更多了</text>
					</view>
				</view>
			</scroll-view>
		</view> -->
	</scroll-view>
</template>

<script>
	export default {
		name: "recommend",
		props: {
			menuShow: {
				type: Boolean,
				default: false,
			},
			page: {
				type: Object,
				default: () => {
					main: '';
					minor: ''
				}
			}
		},
		data() {
			return {
				zIndex: 30,
				className: '',
				recommendList: [],
				systemInfo: getApp().globalData.systemInfo,
				scrollTop: 0,
			}
		},
		watch: {
			menuShow(result) {
				this.checkPage()
			},
		},
		mounted() {
			console.log("加载首页", uni.getSystemInfoSync());
			this.checkPage()
			this.getList()
		},
		methods: {
			pageScroll(e) {
				this.scrollTop = e.detail.scrollTop
			},
			checkPage() {
				let params = this.$handle.className(this.menuShow, this.page, 'index')
				this.className = params.class
				this.zIndex = params.zIndex
			},
			switchInPage() {
				this.$emit("switch", 'index')
			},
			// 去搜索
			toSearch() {
				uni.navigateTo({
					url: "/pages/search/search"
				})
			},
			// 去详情
			viewPage(id) {
				uni.navigateTo({
					url: `/pages/detail/viewDetail?id=${id}`
				})
			},
			// 获取数据
			getList() {
				uni.showLoading({
					title: "数据加载中..."
				})
				uniCloud.callFunction({
					name: 'get',
					data: {
						action: "getBookList",
					}
				}).then(res => {
					uni.hideLoading()
					console.log(res);
					let list = res.result.data
					for (let i in list) {
						this.recommendList.push(list[i])
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	@import url('main.css');
	.view-content {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background-color: $color-white;
		transition: all .5s;
		box-sizing: border-box;
		// padding-left: 60rpx;
		overflow: scroll;

		.search-box {
			position: fixed;
			left: 0;
			right: 0;
			display: flex;
			width: 630rpx;
			// height: 44px;
			background-color: #f1f1f1;
			padding: 10px;
			border-radius: 8px;
			align-items: center;
			margin: 0 auto;
			transition: all .5s;
			z-index: 9;
			box-sizing: border-box;

			.icon {
				width: 10%;
				justify-content: center;
			}

			.input {
				width: 90%;
			}
		}

		.search-to-top {
			width: 350rpx;
			transform: translateY(-62px) translateX(-20px);
		}

		.card-list {
			margin-top: 40rpx;
			position: relative;

			.nav-title {
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 20rpx;
				margin-left: 60rpx;
			}

			.block-list {
				display: flex;
				padding-right: 100rpx;
				padding: 20rpx 0;

				.block {
					width: 250rpx;
					flex-shrink: 0;

					&:first-child {
						margin-left: 60rpx;
					}

					.cover {
						width: 180rpx;
						height: 240rpx;
						border-radius: 16rpx;
						box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
						margin-bottom: 10rpx;
						box-sizing: border-box;
					}

					.title {
						width: 200rpx;
						font-size: 26rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}

					.author {
						width: 200rpx;
						font-size: 24rpx;
						color: $text-color-gray;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}
				}

				.placeholder-block {
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
			}
		}
	}

	/* 临时 */

	.block-list {
		display: flex;
		flex-wrap: wrap;
		padding: 150rpx 60rpx 500rpx 60rpx;

		.block {
			width: 33%;
			flex-shrink: 0;
			display: flex;
			flex-direction: column;
			transition: all 1s;
			transform: translateY(1000px);
			opacity: 0;
			margin-bottom: 40rpx;
			padding: 0 16rpx;
			box-sizing: border-box;

			@for $i from 1 to 99 {
				&:nth-child(#{$i}) {
					animation: show-block .8s forwards $i*0.1s;
				}
			}

			.cover {
				width: 100%;
				height: 240rpx;
				border-radius: 16rpx;
				box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
				margin: 0 auto 10rpx auto;
			}

			.title {
				width: 100%;
				font-size: 26rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}

			.author {
				width: 100%;
				font-size: 24rpx;
				color: $text-color-gray;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}
	}

	@keyframes show-block {
		from {
			transform: translateY(500px);
			opacity: 0;
		}

		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
