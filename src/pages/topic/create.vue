<template>
	<view class="">
		<u-sticky offset-top="0">
			<view class="menu-top">
				<view class="menu-top__button" @click="selectAll">{{isSelectAll?'全不选':'全选'}}</view>
				<view class="menu-top__button" @click="filterShow=true">筛选</view>
				<view class="menu-top__text">已选：{{selectNum}}道题</view>
			</view>
		</u-sticky>
		<view class="interview-list">
			<view class="interview-list__block" v-for="(item,index) in interviewList" :key="index">
				<topic-item :item='item' :answer="false" :button="item.select?['remove']:['join']" :index="index"
					@join="selectInterview" @remove="removeInterview"></topic-item>
			</view>
		</view>
		<view class="bottom-bar">
			<image class="topic-edit-icon" src="/static/images/topic-edit.svg" mode="heightFix"
				@click="examInfoPop=true"></image>
			<view class="bottom-bar-button">
				<view class="bottom-bar__button" style="background: #7bcfa6;" @click="previewTopic">预览试题</view>
				<view class="bottom-bar__button" @click="createToExam">确认生成</view>
			</view>
		</view>
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
		<!-- 信息弹窗 -->
		<u-popup :show="examInfoPop" @close="examInfoPop=false" closeable round="20rpx" mode="center">
			<view class="exam-info">
				<view class="exam-info__title">试卷信息</view>
				<view class="exam-cell">
					<u-cell title="试卷标题" size="large" :titleStyle="{'white-space': 'nowrap'}">
						<template #value>
							<input v-model="topicInfo.title" type="text" placeholder="请输入试卷标题">
						</template>
					</u-cell>
					<!-- <u-cell title="试卷数量" size="large" :titleStyle="{'white-space': 'nowrap'}">
						<template #value>
							<input v-model="topicInfo.number" type="number" placeholder="不填则无限数量">
						</template>
					</u-cell> -->
					<u-cell title="截止时间" size="large" :titleStyle="{'white-space': 'nowrap'}">
						<template #value>
							<picker mode="date" :start="startDate" @change="changeEndTime">
								<view>{{topicInfo.endTime}}</view>
							</picker>
						</template>
					</u-cell>
					<u-cell title="时间限制" size="large" :titleStyle="{'white-space': 'nowrap'}">
						<template #value>
							<input v-model="topicInfo.limitTime" type="number" maxlength="3" placeholder="不填则不限制时间">
						</template>
						<template #right-icon>
							<view>分钟</view>
						</template>
					</u-cell>
				</view>
				<view class="exam-info__button">
					<u-button color="#3478F5" text="确定" :customStyle="{width:'220rpx',margin:0}"
						@click="examInfoPop=false"></u-button>
				</view>
			</view>
		</u-popup>
		<u-popup :show="createSuccessPop" bgColor="transparent" @close="closeCreateSuccess" mode="center">
			<view class="success-pop">
				<image class="success-pop__code" :src="successInfo.code" mode="widthFix"></image>
				<u-button color="#3478F5" text="保存二维码" shape="circle" :customStyle="{margin:'40rpx 0'}"
					@click="saveCodeImage">
				</u-button>
				<image class="success-pop__close" src="/static/images/close-icon-white.svg" mode="widthFix"
					@click="closeCreateSuccess"></image>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import topicItem from '@/components/topic-item/topic-item'
	import {
		request
	} from '@/utils/request.js'
	import dayjs from 'dayjs'
	export default {
		components: {
			topicItem
		},
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
				examInfoPop: false,
				filterShow: false,
				selectNum: 0,
				selectList: [],
				isSelectAll: false,
				startDate: '',
				topicInfo: {
					title: "",
					number: "",
					endTime: "",
					limitTime: "",
				},
				createSuccessPop: false,
				successInfo: {
					code: "/static/images/logo.png",
					id: "",
				},
			}
		},
		onLoad() {
			this.getLabel()
			this.getData()
			this.startDate = dayjs().add(1, 'day').format('YYYY-MM-DD')
			this.topicInfo.endTime = dayjs().add(1, 'day').format('YYYY-MM-DD')
		},
		methods: {
			// 保存二维码
			saveCodeImage() {
				uni.getImageInfo({
					src: this.successInfo.code,
					success: (res) => {
						let path = res.path;
						uni.saveImageToPhotosAlbum({
							filePath: path,
							success: (res) => {
								uni.showToast({
									title:"保存成功!"
								})
							},
							fail: (res) => {
								uni.showToast({
									title:"保存成功!",
									icon:"none"
								})
							}
						})
					},
					fail(res) {
						console.log(res)
						this.toast('保存失败')
					}
				})
			},
			// 关闭成功弹窗
			closeCreateSuccess() {
				this.createSuccessPop = false
				uni.navigateBack({
					delta: 1
				})
			},
			// 生成试题
			createToExam() {
				let info = this.topicInfo
				if(info.limitTime){
					if(info.limitTime<=0){
						uni.showToast({
							title:"答题限制时间不能小于或等于0",
							icon:"none"
						})
						this.examInfoPop = true
						return
					}
				}
				let params = {
					title: info.title,
					topic: this.selectList,
					number: info.number ? info.number : -1,
					limitTime: info.limitTime ? info.limitTime : -1,
					endTime: info.endTime,
				}
				uni.showLoading({
					title: "生成中...",
					mask: true
				})
				request('add/createSubject', params).then(res => {
					let {
						shareImg,
						id
					} = res.data
					this.successInfo = {
						code: shareImg,
						id,
					}
					this.createSuccessPop = true
					uni.hideLoading()
				}).catch(res => {
					uni.hideLoading()
					uni.showToast({
						title: res.msg,
						icon: "none"
					})
				})
			},
			// 选择时间
			changeEndTime(e) {
				this.topicInfo.endTime = e.detail.value
			},
			// 预览试题
			previewTopic() {
				let topic = JSON.stringify(this.selectList)
				uni.navigateTo({
					url: `/pages/topic/detail?type=preview&topic=${topic}`
				})
			},
			// 全选题目
			selectAll() {
				if (this.isSelectAll) {
					this.interviewList.forEach(item => {
						let index = this.selectList.findIndex(items => {
							item._id == items
						})
						this.selectList.splice(index, 1)
					})
				} else {
					this.interviewList.forEach(item => {
						if (!this.selectList.includes(item._id)) {
							this.selectList.push(item._id)
						}
					})
				}

				this.checkSelect()
			},
			// 关闭筛选弹窗
			closeFilter() {
				this.filterShow = false
			},
			// 选择面试题
			selectInterview(data) {
				let id = data._id
				if (this.selectList.includes(id)) return
				this.selectList.push(id)
				this.checkSelect()
			},
			// 移出题库
			removeInterview(data) {
				let id = data._id
				let index = this.selectList.findIndex(item => {
					return id == item
				})
				this.selectList.splice(index, 1)
				this.checkSelect()
			},
			// 检测题库
			checkSelect() {
				this.interviewList.map(item => {
					item.select = this.selectList.includes(item._id)
				})
				this.selectNum = this.selectList.length
				let isSelectAll = true
				this.interviewList.forEach(item => {
					if (!item.select) {
						isSelectAll = false
					}
				})
				this.isSelectAll = isSelectAll
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
				request('get/getLabelList').then(res => {
					this.labelList = res.data.map(item => {
						item.check = false
						return item
					})
				})
			},
			// 获取数据
			getData() {
				let params = {
					page: this.pages,
					limit: 15,
					level: this.levelValue,
					label: this.labelValue
				}
				request('get/getTopicList', params).then(res => {
					let list = res.data
					list.forEach(item => {
						this.interviewList.push(item)
					})
					if (list.length < 15) {
						this.nodata = true
					}
					this.checkSelect()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.success-pop {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		&__code {
			width: 70vw;
			border-radius: 20rpx;
		}

		&__close {
			width: 60rpx;
		}
	}

	.exam-info {
		width: 90vw;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 34rpx;
		box-sizing: border-box;

		&__title {
			text-align: center;
			font-size: 32rpx;
		}

		.exam-cell {
			margin-top: 40rpx;

			input {
				text-align: end;
				line-height: 1;
			}
		}

		&__button {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			margin-top: 30rpx;
		}
	}

	.menu-top {
		display: flex;
		align-items: center;
		width: 100%;
		background-color: #fff;
		height: 88rpx;

		&__button {
			flex: 1;
			text-align: center;
			font-size: 28rpx;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;
		}

		&__text {
			flex: 2;
			font-size: 28rpx;
			text-align: center;
		}
	}

	.bottom-bar {
		width: 100%;
		height: 128rpx;
		background-color: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 40rpx;
		box-sizing: border-box;

		.topic-edit-icon {
			height: 48rpx;
		}

		.bottom-bar-button {
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}

		&__button {
			width: 228rpx;
			height: 78rpx;
			background: $color-main;
			text-align: center;
			border-radius: 68rpx;
			line-height: 78rpx;
			font-size: 28rpx;
			color: #fff;
			margin-left: 20rpx;
		}
	}

	.interview-list {
		padding: 60rpx 60rpx 200rpx 60rpx;

		&__block {
			opacity: 0;

			@for $i from 1 to 99 {
				&:nth-child(#{$i}) {
					animation: fade-in-bottom .8s forwards $i*0.1s;
				}
			}
		}
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
</style>
