<template>
	<view class="page-content">
		<u-notify ref="uTips"></u-notify>
		<view class="progress-box">
			<view class="progress" :style="{'width':read_progress*100+'%'}"></view>
		</view>
		<view class="read-habit" v-show="habitPop" @touchmove.stop>
			<view class="blur-layer"></view>
			<view class="pop">
				<view class="title">请选择您的阅读习惯</view>
				<view class="button" @click="readHabitChose('swiper')">
					<image class="icon" src="/static/images/swiper-icon.svg"></image>
					<text class="text">左右滑动查看</text>
				</view>
				<view class="button" @click="readHabitChose('scroll')">
					<image class="icon" src="/static/images/scroll-icon.svg"></image>
					<text class="text">上下滑动查看</text>
				</view>
			</view>
		</view>
		<view class="data-list" v-if="readHabit=='scroll'">
			<view class="block line" v-for="(item,index) in info.list" :key="index">
				<view class="title">{{item.title}}</view>
				<n-parse :content="item.content"></n-parse>
			</view>
		</view>
		<swiper v-if="readHabit=='swiper'" class="data-list" :current="contentIndex"
			:style="{'height':screenHeight+'px'}" @change="swiperContent">
			<swiper-item class="block" v-for="(item,index) in info.list" :key="index">
				<scroll-view scroll-y :style="{'height':screenHeight+'px'}">
					<view class="title">{{item.title}}</view>
					<n-parse :content="item.content"></n-parse>
					<view style="width: 100%;height: 20rpx;"></view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	import nParse from '@/components/n-parse/parse.vue'
	var timer;
	export default {
		components:{
			nParse
		},
		data() {
			return {
				info: "",
				systemInfo: getApp().globalData.systemInfo,
				scrollHeight: "",
				screenHeight: "",
				contentIndex: 0, // 滑动浏览下标
				viewProgress: 0, // 滚动浏览滚动值
				read_progress: 0,
				habitPop: false,
				readHabit: 'scroll',
				autoSaveFunction: "",
				bookId: '',
				pageType: '',
			}
		},
		created() {

		},
		onPageScroll(e) {
			if (this.readHabit == 'scroll') {
				let system = this.systemInfo
				let scroll = e.scrollTop
				let height = this.scrollHeight - system.screenHeight + system.statusBarHeight + 44
				this.viewProgress = scroll
				this.read_progress = scroll / height
				clearTimeout(timer)

				timer = setTimeout(() => {
					this.saveViewRecord()
				}, 500);
			}
		},
		onLoad(option) {
			let system = this.systemInfo
			this.bookId = option.id
			this.pageType = option.type
			this.screenHeight = system.screenHeight - system.statusBarHeight - 44
			if (option.type == 'history') {
				this.getHistoryView(option.id)
			} else {
				let readHabit = uni.getStorageSync('readHabit')
				if (readHabit) {
					this.readHabit = readHabit
				} else {
					this.habitPop = true
				}
				this.getData(option.id)
			}
		},
		onUnload() {
			clearInterval(this.autoSaveFunction)
		},
		methods: {
			queryContentHeight() {
				let that = this
				if (this.readHabit == 'swiper') {
					this.read_progress = (this.contentIndex + 1) / this.info.list.length
					this.contentIndex = this.historyValue
				} else {
					let query = uni.createSelectorQuery()
					query.select('.page-content').boundingClientRect().exec(function(res) {
						that.scrollHeight = res[0].height
					})
					setTimeout(() => {
						uni.pageScrollTo({
							scrollTop: this.historyValue,
						})
					}, 200)
				}
			},
			// 获取浏览记录
			getHistoryView(id) {
				let list = uni.getStorageSync("viewRecord")
				list = list.find(val => {
					return val.id == id
				})
				this.read_progress = list.progress
				this.readHabit = list.read_habit
				this.historyValue = list.progress_value
				this.getData(id)
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
					title
				} = this.info
				let data = {
					id:_id,
					cover,
					author,
					title
				}
				data.read_habit = this.readHabit
				data.progress = this.read_progress
				data.progress_value = this.readHabit == 'scroll' ? this.viewProgress : this.contentIndex
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
				let length = this.info.list.length
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
			// 获取数据
			getData(id) {
				uniCloud.callFunction({
					name: 'get',
					data: {
						action: "getBookContent",
						params: {
							id,
						}
					}
				}).then(res => {
					this.info = res.result.data
					setTimeout(() => {
						this.queryContentHeight()
					}, 300)
				})
			},
			// 阅读习惯选择
			readHabitChose(type) {
				uni.setStorageSync('readHabit', type)
				this.readHabit = type
				this.habitPop = false
				this.$refs.uTips.show({
					message: '设置成功，如想修改阅读习惯可在首页菜单中的设置修改',
					type: 'success',
					duration: '3000',
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
			z-index: 1;

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
					font-size: 36rpx;
					font-weight: bold;
					padding: 30rpx 0;
					border-bottom: 2rpx solid #eee;
					margin-bottom: 30rpx;
					word-break: break-all;
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

	.read-habit {
		.pop {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			width: 500rpx;
			height: 400rpx;
			border-radius: 16rpx;
			margin: auto;
			z-index: 12000;
			background-color: #FFFFFF;
			padding: 40rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.4);

			.title {
				font-size: 28rpx;
				font-weight: bold;
			}

			.button {
				width: 400rpx;
				height: 88rpx;
				background: linear-gradient(to right, $color-main, $color-second, $color-shallow);
				border-radius: 16rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 40rpx;

				.icon {
					width: 60rpx;
					height: 60rpx;
					margin-right: 40rpx;
				}

				.text {
					font-size: 28rpx;
					font-weight: bold;
					color: $text-color-inverse;
				}
			}
		}
	}
</style>
