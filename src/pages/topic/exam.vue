<template>
	<view class="exam-page">
		<u-sticky>
			<view class="exam-time">
				<text class="exam-time__title">剩余时间</text>
				<text class="exam-time__text">648s</text>
				<view class="exam-time__process" style="width: 50%;"></view>
			</view>
		</u-sticky>
		<view class="exam-title">
			<text>深圳腾讯考试面试题目</text>
			<u-line margin="40rpx 0 0 0"></u-line>
		</view>
		<view class="exam-list">
			<view class="exam-list__block" v-for="(item,index) in interviewList" :key="index">
				<topic-item :item='item' :button="[]" :index="index" @select="selectAnswer"></topic-item>
			</view>
		</view>
		<n-bottom>
			<view class="bottom-button">
				<u-button color="#3478F5" shape="circle" :customStyle="{width:'288rpx',margin:0}">提交答案</u-button>
			</view>
		</n-bottom>
	</view>
</template>

<script>
	import topicItem from '@/components/topic-item/topic-item'
	import {
		request
	} from '@/utils/request.js'
	export default {
		components: {
			topicItem
		},
		data() {
			return {
				examId: '',
				examInfo: '',
				interviewList: [],
			}
		},
		onLoad(option) {
			console.log(option);
			this.examId = option.scene
			this.getExamDetail()
		},
		methods: {
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
			// 获取考试信息
			getExamDetail() {
				let params = {
					id: this.examId
				}
				request('get/getExamDetail', params).then(res => {
					console.log(res);
					this.examInfo = res.data
					let list = res.topic
					list.forEach(item => {
						if (item.type !== 2) {
							item.option.map((items, index) => {
								items.check = false
							})
						}
					})
					this.interviewList = list
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.exam-page {
		.exam-time {
			width: 100%;
			height: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			position: relative;
			background-color: $color-shallow;
			text {
				font-size: 24rpx;
				color: #333;
				position: relative;
				z-index: 1;
				margin: 0 10rpx;
			}

			&__process {
				position: absolute;
				height: 100%;
				left: 0;
				right: 0;
				background: $color-second;
			}
		}

		.exam-title {
			font-size: 36rpx;
			font-weight: bold;
			padding: 40rpx;
		}

		.exam-list {
			padding: 0 40rpx;

			&__block {
				opacity: 0;

				@for $i from 1 to 99 {
					&:nth-child(#{$i}) {
						animation: fade-in-bottom .8s forwards $i*0.1s;
					}
				}
			}
		}
		.bottom-button{
			display: flex;
			align-items: center;
			justify-content: flex-end;
			box-sizing: border-box;
			padding: 0 40rpx;
			width: 100%;
			height: 100%;
		}
	}
</style>
