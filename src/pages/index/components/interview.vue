<template>
	<scroll-view scroll-y :class="['view-content',className]"
		:style="{'height':systemInfo.screenHeight+'px','padding-top':systemInfo.statusBarHeight+60+'px','z-index':zIndex}"
		@scrolltolower="loadingData" @scroll="scrollPage">
		<view v-if="menuShow" class="blur-layer" @touchmove.stop @click="switchInPage"></view>
		<!-- <view class="filter-bar" :style="{'padding-top':systemInfo.statusBarHeight+'px'}">
			<view class="filter-bar__icon" @click="filterShow=true">
				<image src="/static/images/filter-icon.svg"></image>
			</view>
		</view> -->
		<view class="interview-list">
			<view class="interview-list__block" :class="item.className" v-for="(item,index) in interviewList"
				:key="index">
				<topic-item :item='item' :index="index" @show="showAnswer" @select="selectAnswer"></topic-item>
			</view>
		</view>
		<!-- 加载数据提示 -->
		<n-loading-bottom v-if="!nodata" :show="loading"></n-loading-bottom>
		<!-- 创建面试题按钮 -->
		<view class="float-box">
			<view class="float-btn" :class="[floatShow?'slide-in-fwd-center':'slide-out-bck-center']">
				<image class="float-icon" src="/static/images/add-icon.svg" mode="aspectFill" @click="createTopic">
				</image>
			</view>
			<view class="float-btn" :class="[floatShow?'slide-in-fwd-center':'slide-out-bck-center']">
				<image class="float-icon" src="/static/images/filter-icon.svg" mode="aspectFill"
					@click="filterShow=true">
				</image>
			</view>
		</view>
		<!-- 到底提示 -->
		<u-divider v-if="nodata" text="已经到底了" :customStyle="{padding:'40rpx 60rpx'}"></u-divider>
		<!-- 提示弹窗 -->
		<u-toast ref="uToast" />
		<!-- 筛选弹窗 -->
		<u-popup :show="filterShow" @close="closeFilter" round="16" mode="bottom">
			<view class="filter">
				<view class="filter-top">筛选</view>
				<view class="filter-title">等级</view>
				<view class="filter-list">
					<view class="filter-level" :class="item.check?'filter-level--active':''"
						v-for="(item,index) in levelOption" @click="selectLevel(index)">{{item.name}}</view>
				</view>
				<view class="filter-title">类型</view>
				<view class="filter-list">
					<view class="filter-label" :class="item.check?'filter-label--active':''"
						v-for="(item,index) in labelList" @click="selectLabel(index)">{{item.name}}</view>
				</view>
			</view>
			<view class="filter-button">
				<u-button text="重置" color="#7bcfa6" shape="circle" :customStyle="{margin:'10rpx'}" @click="toReset">
				</u-button>
				<u-button text="确定" color="#3478F5" shape="circle" :customStyle="{margin:'10rpx'}" @click="toFilter">
				</u-button>
			</view>
		</u-popup>
	</scroll-view>
</template>

<script>
	import topicItem from '@/components/topic-item/topic-item'
	import mixin from './mixins.js'
	export default {
		components: {
			topicItem
		},
		name: "interview",
		mixins: [mixin],
		data() {
			return {
				interviewList: [],
				levelOption: [{
					name: "初级",
					value: 0,
					check: false,
				}, {
					name: "中级",
					value: 1,
					check: false,
				}, {
					name: "高级",
					value: 2,
					check: false,
				}],
				labelList: [],
				levelValue: '',
				labelValue: [],
				pages: 1,
				nodata: false,
				loading: false,
				filterShow: false,

				scrollValue: 0,
				floatShow: true,
			}
		},
		watch: {
			page(newVal) {
				if (newVal.main == 'interview' && this.interviewList.length == 0) {
					this.getData()
					this.getLabel()
				}
			},
		},
		methods: {
			// 监控滚动
			scrollPage(e) {
				let scroll = e.detail.scrollTop
				console.log(e.detail.scrollTop, scroll < this.scrollValue);
				if (scroll > this.scrollValue + 200) {
					this.scrollValue = scroll
					this.floatShow = false
				} else if (scroll < this.scrollValue - 200) {
					this.scrollValue = scroll
					this.floatShow = true
				}
			},
			// 生成面试题
			createTopic() {
				uni.navigateTo({
					url: '/pages/topic/create'
				})
			},
			// 滚动到底部
			loadingData() {
				if (this.nodata) return
				this.pages += 1
				this.loading = true
				this.getData()
			},
			// 重置
			toReset() {
				this.levelOption.map(item => {
					item.check = false
				})
				this.labelList.map(item => {
					item.check = false
				})
				this.levelValue = ''
				this.labelValue = []
			},
			// 确定筛选
			toFilter() {
				let result = []
				this.labelList.forEach(item => {
					if (item.check) {
						result.push(item.name)
					}
				})
				this.labelValue = result
				this.interviewList = []
				this.pages = 1
				this.nodata = false
				this.getData()
				this.closeFilter()
			},
			// 选择等级
			selectLevel(index) {
				if (this.levelOption[index].check) {
					this.levelOption[index].check = false
					this.levelValue = ''
				} else {
					this.levelOption.map(item => {
						item.check = false
					})
					this.levelOption[index].check = true
					this.levelValue = this.levelOption[index].value
				}
			},
			// 选择标签
			selectLabel(index) {
				this.labelList[index].check = !this.labelList[index].check
			},
			// 获取标签
			getLabel() {
				this.$http.request('get/getLabelList').then(res => {
					this.labelList = res.data.map(item => {
						item.check = false
						return item
					})
				})
			},
			// 关闭筛选弹窗
			closeFilter() {
				this.filterShow = false
			},
			// 显示答案
			showAnswer(index) {
				let data = this.interviewList[index]
				this.interviewList[index].show = !this.interviewList[index].show
				this.interviewList[index].answered = true
				if (data.type !== 2 && !data.wrong) {
					data.option.forEach(item => {
						if (item.check != item.right) {
							this.interviewList[index].wrong = true
							uni.vibrateLong()
						}
					})
				}
			},
			// 选择答案
			selectAnswer(index, i) {
				let data = this.interviewList[index]
				let type = data.type
				if (data.answered) return
				if (type === 0) {
					this.interviewList[index].option[i].check = !this.interviewList[index].option[i].check
				} else if (type === 1) {
					this.interviewList[index].option.map(item => {
						item.check = false
					})
					this.interviewList[index].option[i].check = true
				}
			},
			// 获取数据
			getData() {
				uni.showLoading({
					title: "数据加载中..."
				})
				let params = {
					page: this.pages,
					limit: 15,
					level: this.levelValue,
					label: this.labelValue
				}
				this.$http.request('get/getTopicList', params).then(res => {
					uni.hideLoading()
					this.loading = false
					let list = res.data
					list.forEach((item, index) => {
						item.className = 'animation' + (index + 1)
						item.show = false
						item.wrong = false
						item.answered = false
						if (item.type !== 2) {
							item.option.map((items, index) => {
								items.check = false
								if (item.answer.indexOf(index) == -1) {
									items.right = false
								} else {
									items.right = true
								}
							})
						}
						this.interviewList.push(item)
					})
					if (list.length < 15) {
						this.nodata = true
					}
				}).catch(res => {
					this.loading = true
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	@import url('../css/main.css');

	.slide-in-fwd-center {
		-webkit-animation: scale-in-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
		animation: scale-in-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
	}

	.slide-out-bck-center {
		-webkit-animation: slide-out-bck-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
		animation: slide-out-bck-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
	}

	.float {
		&-box {
			position: fixed;
			right: 30rpx;
			bottom: 60rpx;
			display: flex;
			align-items: flex-end;
			flex-direction: column;
			justify-content: center;
		}

		&-btn {
			width: 68rpx;
			height: 68rpx;
			margin-top: 40rpx;
			background-color: $color-main;
			border-radius: 50%;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: center;
			opacity: 0;
		}

		&-icon {
			width: 36rpx;
			height: 36rpx;
		}
	}

	.filter {
		position: relative;
		padding: 0 40rpx;
		max-height: 60vh;
		overflow-y: scroll;

		&-top {
			font-size: 32rpx;
			font-weight: bold;
			color: #000;
			text-align: center;
			padding: 30rpx 0;
			position: sticky;
			top: 0;
			background-color: #fff;
		}

		&-title {
			font-size: 28rpx;
			font-weight: bold;
			color: #333;
			margin-bottom: 16rpx
		}

		&-list {
			display: flex;
			flex-wrap: wrap;
			margin-bottom: 20rpx;
		}

		&-level {
			padding: 0 20rpx;
			height: 50rpx;
			text-align: center;
			line-height: 50rpx;
			border-radius: 8rpx;
			border: 2rpx solid $color-shallow;
			color: $color-shallow;
			font-size: 26rpx;
			margin: 0 20rpx 20rpx 0;

			&--active {
				background-color: $color-shallow;
				border: 2rpx solid transparent;
				color: #fff;
			}
		}

		&-label {
			padding: 0 20rpx;
			min-height: 50rpx;
			word-break: break-all;
			display: flex;
			justify-content: center;
			align-items: center;
			border-radius: 8rpx;
			border: 2rpx solid $color-main;
			color: $color-main;
			font-size: 26rpx;
			margin: 0 20rpx 20rpx 0;

			&--active {
				background-color: $color-main;
				border: 2rpx solid transparent;
				color: #fff;
			}
		}

		&-button {
			display: flex;
			align-items: center;
			padding: 20rpx 30rpx;
			position: sticky;
			bottom: 0;
			background-color: #fff;
		}

		&-bar {
			position: fixed;
			width: 100%;
			height: 48px;
			background-color: #fff;
			top: 0;
			left: 0;
			z-index: 99;
			display: flex;
			align-items: center;
			justify-content: center;

			&__icon {
				width: 48rpx;
				height: 48rpx;
				border: 4rpx solid #000;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 50%;

				image {
					width: 30rpx;
					height: 30rpx;
				}
			}
		}
	}

	@for $i from 1 to 16 {
		.animation#{$i} {
			animation: fade-in-bottom .8s forwards $i*0.2s;
		}
	}

	.interview-list {
		padding: 0 40rpx;

		&__block {
			opacity: 0;
		}
	}
</style>
