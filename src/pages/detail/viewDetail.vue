<template>
	<view class="page-content">
		<view class="progress-box">
			<view class="progress" :style="{'width':read_progress*100+'%'}"></view>
		</view>
		<view class="data-list">
			<view class="block line" v-for="(item,index) in bookContent" :key="index">
				<view class="title" :class="{'sticky':contentIndex==index}">{{item.title}}</view>
				<n-html :content="item.content"></n-html>
			</view>
		</view>
	</view>
</template>

<script>
	var timer;
	export default {
		data() {
			return {
				bookInfo: "",
				bookContent: [],
				scrollHeight: "",
				screenHeight: "",
				contentIndex: 0, // 滑动浏览下标
				read_progress: 0,
				pageScroll: 0,
				autoSaveFunction: "",
				bookId: '',
				pageType: '',
				historyValue: 0,
				total: 0,
			}
		},
		onPageScroll(e) {
			let system = this.systemInfo
			let scroll = e.scrollTop
			let height = this.scrollHeight - system.screenHeight + system.statusBarHeight + 44
			this.pageScroll = scroll
			this.read_progress = scroll / height
			clearTimeout(timer)

			let index = this.bookContent.findIndex(item => {
				if (scroll >= item.element.top && scroll < item.element.bottom) {
					return item
				}
			})
			this.contentIndex = index
			console.log('scroll', index);

			timer = setTimeout(() => {
				this.saveViewRecord()
			}, 500);
		},
		onLoad(option) {
			let system = this.systemInfo
			this.bookId = option.id
			this.pageType = option.type
			this.screenHeight = system.screenHeight - system.statusBarHeight - 44
			if (option.type == 'history') {
				this.getHistoryView()
			} else if (option.type == 'share') {
				this.contentIndex = option.value
				this.getData()
			} else {
				this.getData()
			}
		},
		onUnload() {
			clearInterval(this.autoSaveFunction)
		},
		onShareAppMessage() {
			let info = this.bookInfo
			let value = this.contentIndex
			let title = `${info.title}—${this.bookContent[this.contentIndex].title}`
			return {
				title,
				path: `pages/detail/viewDetail?id=${info._id}&type=share&value=${value}`,
				imageUrl: info.cover,
			}
		},
		methods: {
			getNodeHeight(id) {
				return new Promise((resovle) => {
					const query = uni.createSelectorQuery().in(this)
					query.select(id).boundingClientRect((data) => {
						resovle(data)
					}).exec()
				})
			},
			async queryContentHeight() {
				let list = this.bookContent
				let scrollHeight = await this.getNodeHeight('.page-content')
				this.scrollHeight = scrollHeight.height
				const query = uni.createSelectorQuery().in(this)
				query.selectAll('.block').boundingClientRect((data) => {
					list.map((item, index) => {
						item.element = data[index]
						return item
					})
					let top = list[this.contentIndex].element.top
					uni.pageScrollTo({
						scrollTop: top,
					})
				}).exec()
			},
			// 获取浏览记录
			getHistoryView() {
				let list = uni.getStorageSync("viewRecord")
				list = list.find(val => {
					return val.id == this.bookId
				})
				this.contentIndex = list.progress_value
				this.getData()
			},
			// 获取数据
			getData() {
				this.$http.request('get/getBookInfo', {
					id: this.bookId
				}).then(res => {
					this.bookInfo = res.data
					uni.setNavigationBarTitle({
						title: this.bookInfo.title
					})
				})
				this.$http.request('get/getBookContent', {
					book_id: this.bookId,
					page: 1,
					limit: 999,
				}).then(res => {
					this.bookContent = res.data
					this.total = res.total
					uni.showLoading({
						title: "内容加载中..."
					})
					this.$nextTick(() => {
						uni.hideLoading()
						setTimeout(() => {
							this.queryContentHeight()
						}, 100)
					})
				})
			},
			// 获取自动保存
			scrollAutoSave() {
				let that = this
			},
			// 保存数据
			saveViewRecord() {
				let list = uni.getStorageSync("viewRecord")
				let {
					_id,
					cover,
					author,
					title,
				} = this.bookInfo
				let total = this.total
				let data = {
					id: _id,
					cover,
					author,
					title
				}
				data.progress = this.read_progress
				data.progress_title = this.bookContent[this.contentIndex].title
				data.progress_value = this.contentIndex
				if (list) {
					let index = ''
					for (let i in list) {
						if (list[i].id == data.id) {
							index = i
						}
					}
					if (index && index != -1) {
						list.splice(index, 1)
					}
					list.unshift(data)
				} else {
					list = []
					list.push(data)
				}
				uni.setStorageSync("viewRecord", list)

			},
			// 滑动内容
			swiperContent(e) {
				this.contentIndex = e.detail.current
				let index = e.detail.current + 1
				let length = this.total
				this.read_progress = index / length
				this.saveViewRecord()
			},
			// 预览图片
			previewImg(imgs, index) {
				uni.previewImage({
					urls: imgs,
					current: index
				})
			},
		}
	}
</script>

<style lang="scss">
	.page-content {
		.progress-box {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 6rpx;
			background-color: transparent;
			z-index: 2;

			.progress {
				background: linear-gradient(to right, $color-main, $color-second, $color-shallow);
				height: 100%;
			}
		}

		.data-list {
			box-sizing: border-box;

			.line {
				position: relative;

				&::after {
					content: "";
					position: absolute;
					bottom: 0;
					width: 200%;
					left: -50rpx;
					height: 1px;
					background: #333333;
				}

				&:last-child {
					&::after {
						height: 0;
					}
				}
			}

			.block {
				padding: 0 40rpx 40rpx 40rpx;
				box-sizing: border-box;

				.title {
					width: 100%;
					font-size: 36rpx;
					font-weight: bold;
					padding: 30rpx 0;
					border-bottom: 2rpx solid #ccc;
					margin-bottom: 30rpx;
					word-break: break-all;
					background-color: #fff;
				}

				.sticky {
					width: 100%;
					position: sticky;
					top: 0;
					z-index: 9;
					z-index: 1;
					border-bottom: 2rpx solid transparent;
				}

				.content {
					padding-bottom: 40rpx;

					.title-text {
						margin-top: 20rpx;
						font-size: 28rpx;
						font-weight: bold;
					}

					.content-text {
						text-indent: 40rpx;
						margin-top: 20rpx;
						font-size: 28rpx;
					}

					.list-text {
						margin-top: 20rpx;

						.text {
							list-style: disc;
						}
					}

					.code-text {
						.code-img {
							width: 100%;
						}
					}
				}
			}
		}
	}
</style>
