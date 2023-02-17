<template>
	<scroll-view scroll-y :class="['view-content',className]"
		:style="{'height':systemInfo.screenHeight+'px','padding-top':systemInfo.statusBarHeight+50+'px','z-index':zIndex}"
		@scroll="pageScroll">
		<view v-if="menuShow" class="blur-layer" @touchmove.stop @click="switchInPage"></view>
		<view :class="['search-box',scrollTop>20?'search-to-top':'']" :style="{top:systemInfo.statusBarHeight+60+'px'}"
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
	</scroll-view>
</template>

<script>
	import mixin from './mixins.js'
	export default {
		name: "database",
		mixins: [mixin],
		data() {
			return {
				recommendList: [],
				scrollTop: 0,
			}
		},
		watch: {
			page(newVal) {
				if (newVal.main == 'database' && this.recommendList.length == 0) {
					this.getList()
				}
			},
		},
		methods: {
			pageScroll(e) {
				this.scrollTop = e.detail.scrollTop
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
				this.$http.request('get/getBookList').then(res => {
					uni.hideLoading()
					let list = res.data
					for (let i in list) {
						this.recommendList.push(list[i])
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	@import url('../css/main.css');

	.view-content {

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

		.block-list {
			display: flex;
			flex-wrap: wrap;
			padding: 150rpx 60rpx 100rpx 60rpx;

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
