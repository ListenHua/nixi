<template>
	<view class="exam-page">
		<template v-if="isLogin&&examShow">
			<u-sticky v-if="examInfo.limitTime>0">
				<view class="exam-time">
					<view class="exam-time__process" style="width: 50%;"></view>
				</view>
			</u-sticky>
			<view class="exam-title">
				<text v-if="examInfo.limitTime>0">({{examInfo.limitTime}}分钟)</text>
				<text>{{examInfo.title}}</text>
				<u-line margin="40rpx 0 0 0"></u-line>
			</view>
			<view class="exam-list">
				<view class="exam-list__block" :id="'topic'+item._id" v-for="(item,index) in interviewList"
					:key="index">
					<topic-item :item='item' :button="answerOver?['study']:[]" :index="index" @select="selectAnswer">
					</topic-item>
				</view>
			</view>
			<n-bottom>
				<view class="bottom-button">
					<u-button color="#3478F5" shape="circle" :customStyle="{width:'288rpx',margin:0}"
						@click="submitAnswer">
						提交答案</u-button>
				</view>
			</n-bottom>
		</template>
		<u-modal :show="loginPop" title="未登录" content='需要登录才能查看试题噢😀' confirmText="去登陆" @confirm="toLogin"></u-modal>
		<u-modal :show="resultPop" title="您的成绩是:" confirmText="我知道了" @confirm="resultPop=false">
			<view class="score-box">
				<view>总题数：{{interviewList.length}}</view>
				<view>答对数：{{score}}</view>
			</view>
		</u-modal>
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
				examId: '',
				examInfo: '',
				interviewList: [],
				surplusTime: 0,
				surplusTimeInterval: '',
				loginPop: false,
				isAnswerAll: false, // 是否已全部答题
				unAnswerTopicId: '',
				scrollTop: 0,
				isLogin: false,
				answerOver: false,
				resultPop: false,
				score: 0,
				examShow:false,
			}
		},
		onShow() {
			if (uni.getStorageSync('userInfo').nickName) {
				this.loginPop = false
				this.getExamDetail()
				this.isLogin = true
			} else {
				this.loginPop = true
				this.isLogin = false
			}
		},
		onLoad(option) {
			this.examId = option.scene
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			// 去登陆
			toLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
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
			// 获取考试信息
			getExamDetail() {
				let params = {
					id: this.examId
				}
				request('get/getExamDetail', params).then(res => {
					console.log(res);
					if (res.data.endTime < dayjs().format("YYYY-MM-DD")) {
						uni.showToast({
							title: "该试卷已过期😟",
							icon: "none"
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/index/index'
							})
						}, 1500)
						return
					}
					this.examShow = true
					this.examInfo = res.data
					if (this.examInfo.limitTime > 0) {
						this.intervalTime()
					}
					let list = res.topic
					list.forEach(item => {
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
					})
					this.interviewList = list
				})
			},
			// 倒计时
			intervalTime() {
				let time = this.examInfo.limitTime * 60
				this.surplusTime = time
				this.surplusTimeInterval = setInterval(() => {
					this.surplusTime -= 1
					if (this.surplusTime <= 0) {
						clearInterval(this.surplusTimeInterval)
					}
				}, 1000)
			},
			// 检查答案
			checkAnswer() {
				let list = this.interviewList
				let isAnswerAll = true
				list.forEach(item => {
					if (item.type != 2) {
						item.answered = false
						item.option.forEach(items => {
							if (items.check) {
								item.answered = true
							}
						})
						if (!item.answered) {
							isAnswerAll = false
							this.unAnswerTopicId = item._id
						}
					}

				})
				this.isAnswerAll = isAnswerAll
			},
			// 滚动到未答题的题目
			async scrollToUnAnswer() {
				let content = await this.getNodeHeight('#topic' + this.unAnswerTopicId)
				uni.pageScrollTo({
					scrollTop: this.scrollTop + content.top,
					duration: 500
				})
			},
			// 提交答案
			submitAnswer() {
				this.checkAnswer()
				console.log("是否已完整答题", this.isAnswerAll);
				if (!this.isAnswerAll) {
					uni.showToast({
						title: "请先回答完所有题目",
						icon: 'none'
					})
					this.scrollToUnAnswer()
					return
				}
				this.checkAnswerRight()
				let params = {
					info: this.examInfo,
					score: this.score,
					topic: this.interviewList
				}
				request('add/answerResult', params).then(res => {
					console.log(res);
					this.answerOver = true
					this.resultPop = true
					clearInterval(this.surplusTimeInterval)
				})
			},
			// 验证答案
			checkAnswerRight() {
				let list = this.interviewList
				let score = list.length
				list.forEach(item => {
					if (item.type !== 2 && !item.wrong) {
						item.option.forEach(items => {
							if (items.check != items.right) {
								item.wrong = true
							}
						})
						if (item.wrong) {
							score -= 1
						}
					}
				})
				this.score = score
			},
			// 获取元素信息
			getNodeHeight(id) {
				return new Promise((resovle) => {
					const query = uni.createSelectorQuery().in(this)
					query
						.select(id)
						.boundingClientRect((data) => {
							resovle(data)
						})
						.exec()
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.exam-page {
		.exam-time {
			width: 100%;
			height: 10rpx;
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

		.bottom-button {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			box-sizing: border-box;
			padding: 0 40rpx;
			width: 100%;
			height: 100%;
		}

		.score-box {
			view {
				font-size: 36rpx;
				color: #333;
				font-weight: bold;
				margin: 20rpx 0;
			}
		}
	}
</style>
