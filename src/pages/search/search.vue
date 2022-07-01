<template>
	<view>
		<div class="costom">
			<view class="search-box">
				<u-icon class="icon" name="search"></u-icon>
				<input v-model="searchValue" focus class="input" type="text" value="" @confirm="searchBook" />
			</view>
		</div>
		<view class="block-list">
			<view class="block" v-for="(item,index) in bookList" :key="index" @click="viewPage(item.id)">
				<image class="cover" :src="item.cover" mode="aspectFill"></image>
				<view class="title">{{item.title}}</view>
				<view class="author">{{item.author}}</view>
			</view>
		</view>
		<view v-if="searchOver&&bookList.length==0" class="placeholder-block">
			<image class="icon" src="/static/images/nodata.svg"></image>
			<text class="text">未搜索到相关内容</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				searchOver: false,
				searchValue: '',
				bookList: '',
			}
		},
		methods: {
			// 去详情
			viewPage(id) {
				uni.navigateTo({
					url: `/pages/detail/viewDetail?id=${id}`
				})
			},
			// 搜索书籍
			searchBook() {
				let value = this.searchValue
				this.searchOver = false
				if (!value) {
					uni.showToast({
						title: "请输入要搜索的内容",
						icon: "none"
					})
					return
				}
				uniCloud.callFunction({
						name: 'get',
						data: {
							action: "getBookList",
							params: {
								key: value,
							}
						}
					}).then(res => {
						this.bookList = []
						let list = res.result.data
						setTimeout(() => {
							for (let i in list) {
								this.bookList.push(list[i])
							}
							this.searchOver = true
						}, 200)
					})
					.catch(() => {
						this.searchOver = true
						this.bookList = []
					})
			},
		}
	}
</script>

<style scoped lang="scss">
	.costom {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		padding: 20rpx 0;
		background-color: #fff;
	}

	.search-box {
		display: flex;
		width: 630rpx;
		background-color: #f1f1f1;
		padding: 20rpx;
		border-radius: 16rpx;
		align-items: center;
		margin: 0 auto;

		.icon {
			width: 10%;
			justify-content: center;
		}

		.input {
			width: 90%;
			font-size: 26rpx;
			font-weight: bold;
			margin-left: 20rpx;
		}
	}

	.block-list {
		display: flex;
		flex-wrap: wrap;
		padding: 150rpx 60rpx 0 60rpx;

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
