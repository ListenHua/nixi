<template>
	<scroll-view scroll-y :class="['view-content',className]"
		:style="{'height':systemInfo.screenHeight+'px','padding-top':systemInfo.statusBarHeight+60+'px','z-index':zIndex}"
		@scrolltolower="loadingData">
		<view v-if="menuShow" class="blur-layer" @touchmove.stop @click="switchInPage"></view>
		<view class="filter-bar" :style="{'padding-top':systemInfo.statusBarHeight+'px'}">
			<view class="filter-bar__icon" @click="filterShow=true">
				<image src="/static/images/filter-icon.svg"></image>
			</view>
		</view>
		<view class="interview-list">
			<view class="interview-list__block" v-for="(item,index) in interviewList" :key="index">
				<topic-item :item='item' :index="index" @show="showAnswer" @select="selectAnswer"></topic-item>
			</view>
		</view>
		<image class="add-btn" src="/static/images/add-icon.svg" mode="aspectFill" @click="createTopic"></image>
		<u-divider v-if="nodata" text="已经到底了" :customStyle="{padding:'40rpx 60rpx'}"></u-divider>
		<!-- 提示弹窗 -->
		<u-toast ref="uToast" />
		<!-- 筛选弹窗 -->
		<u-popup :show="filterShow" @close="closeFilter" mode="top">
			<scroll-view scroll-y style="height: 400rpx;" :style="{'padding-top':systemInfo.statusBarHeight+44+'px'}">
				<view class="filter-pop">
					<view class="filter-level" :class="item.check?'filter-level--active':''"
						v-for="(item,index) in levelOption" @click="selectLevel(index)">{{item.name}}</view>
					<view class="filter-label" :class="item.check?'filter-label--active':''"
						v-for="(item,index) in labelList" @click="selectLabel(index)">{{item.name}}</view>
				</view>
			</scroll-view>
			<view class="filter-button">
				<view class="filter-label filter-label--active" @click="toReset">重置</view>
				<view class="filter-level filter-level--active" @click="toFilter">确定</view>
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
				filterShow: false,
			}
		},
		watch: {
			menuShow(result) {
				if (this.page.main == 'interview' && this.interviewList.length == 0) {
					this.getData()
					this.getLabel()
				}
				this.checkPage()
			},
		},
		methods: {
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
				let params = {
					page: this.pages,
					limit: 15,
					level: this.levelValue,
					label: this.labelValue
				}
				this.$http.request('get/getTopicList', params).then(res => {
					let list = res.data
					list.forEach(item => {
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
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	@import url('main.css');
	.add-btn{
		width: 60rpx;
		height: 60rpx;
		position: fixed;
		right: 20rpx;
		bottom: 30rpx;
	}
	.filter-pop {
		position: relative;
		display: flex;
		flex-wrap: wrap;
		padding: 0 40rpx;

	}

	.filter-level {
		padding: 0 20rpx;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
		border-radius: 8rpx;
		border: 2rpx solid $color-shallow;
		color: $color-shallow;
		font-size: 26rpx;
		margin: 0 20rpx 20rpx 0;
	}

	.filter-level--active {
		background-color: $color-shallow;
		border: 2rpx solid transparent;
		color: #fff;
	}

	.filter-label {
		padding: 0 20rpx;
		height: 50rpx;
		text-align: center;
		line-height: 50rpx;
		border-radius: 8rpx;
		border: 2rpx solid $color-main;
		color: $color-main;
		font-size: 26rpx;
		margin: 0 20rpx 20rpx 0;
	}

	.filter-label--active {
		background-color: $color-main;
		border: 2rpx solid transparent;
		color: #fff;
	}

	.filter-button {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 20rpx 60rpx;
	}

	.interview-list {
		padding: 0 40rpx;

		&__block {
			opacity: 0;
			animation: fade-in-bottom .8s forwards 0.3s;
		}
	}

	.filter-bar {
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
</style>
