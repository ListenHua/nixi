<template>
	<view class="exam-page" v-if="examShow">
		<template>
			<u-sticky v-if="examInfo.limitTime>0">
				<view class="exam-time">
					<view class="exam-time__process" :style="{'width':`${surplusTime/(examInfo.limitTime*60)*100}%`}">
					</view>
				</view>
			</u-sticky>
			<view class="exam-title">
				<text v-if="examInfo.limitTime>0">({{examInfo.limitTime}}分钟)</text>
				<text>{{examInfo.title}}</text>
				<image v-if="pageType!=0" src="/static/images/delete-icon.png" mode="heightFix" @click="deleteHistory">
				</image>
				<u-line margin="40rpx 0 0 0"></u-line>
			</view>
			<view class="exam-list">
				<view class="exam-list__block" :id="'topic'+item._id" v-for="(item,index) in interviewList"
					:key="index">
					<topic-item :item='item' :button="answerOver?['study']:[]" :index="index" @select="selectAnswer"
						@show="showAnswer">
					</topic-item>
				</view>
			</view>
			<n-bottom v-if="!answerOver">
				<view class="bottom-button">
					<u-button color="#3478F5" shape="circle" :customStyle="{width:'288rpx',margin:0}"
						@click="submitAnswer">
						提交答案</u-button>
				</view>
			</n-bottom>
		</template>
		<view class="float-btn" v-if="pageType==1">
			<image src="/static/images/answer-user-icon.png" mode="aspectFill" @click="answerInfoPop=true"></image>
		</view>
		<view class="float-btn" v-if="pageType==2">
			<image src="/static/images/qrcode-icon.png" mode="aspectFill" @click="initQRcode"></image>
		</view>
		<u-modal :show="resultPop" title="您的成绩是:" confirmText="我知道了" @confirm="resultPop=false">
			<view class="score-box">
				<view>总题数：{{interviewList.length}}</view>
				<view>答对数：{{score}}</view>
			</view>
		</u-modal>
		<!-- 答题者信息 -->
		<u-popup :show="answerInfoPop" mode="center" round="16" @close="answerInfoPop=false">
			<view class="answer-info">
				<view class="answer-info__title">回答者信息</view>
				<view class="answer-info__block">
					<text class="answer-info__block__title">昵称(ID)：</text>
					<text class="answer-info__block__text">{{answererInfo.nickName}}({{answererInfo.id}})</text>
				</view>
				<view class="answer-info__block">
					<text class="answer-info__block__title">回答时间：</text>
					<text class="answer-info__block__time">{{answerTime}}</text>
				</view>
				<view class="answer-info__block">
					<text class="answer-info__block__title">答对：</text>
					<text class="answer-info__block__right">{{score}}</text>
				</view>
				<view class="answer-info__block">
					<text class="answer-info__block__title">答错：</text>
					<text class="answer-info__block__wrong">{{interviewList.length-score}}</text>
				</view>
			</view>
		</u-popup>
		<!-- 分享海报 -->
		<u-popup :show="createSuccessPop" bgColor="transparent" @close="createSuccessPop = false" mode="center">
			<view class="success-pop">
				<image class="success-pop__code" :src="poster" mode="widthFix"></image>
				<u-button color="#3478F5" text="保存图片" shape="circle" :customStyle="{margin:'40rpx 0'}"
					@click="saveCodeImage">
				</u-button>
				<image class="success-pop__close" src="/static/images/close-icon-white.svg" mode="widthFix"
					@click="createSuccessPop = false"></image>
			</view>
		</u-popup>
		<canvas id="qrcode" canvas-id="qrcode" :style="{width: canvasWidth+'px', height: canvasHeight+'px'}"></canvas>

	</view>
</template>

<script>
	import topicItem from '@/components/topic-item/topic-item'
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
				isAnswerAll: false, // 是否已全部答题
				unAnswerTopicId: '',
				scrollTop: 0,
				answerOver: false,
				resultPop: false,
				score: 0,
				examShow: false,

				pageType: 0,
				answererInfo: '',
				answerTime: '',
				answerInfoPop: false,

				createSuccessPop: false,
				poster: '',
				code: '',
				cover: '',
				avatar: '',
				codeDesc: '',
				coverWidth: 0,
				coverHeight: 0,
				canvasWidth: 0,
				canvasHeight: 0,

			}
		},
		onLoad(option) {
			if (option.scene) {
				this.examId = option.scene
			}
			if (option.id) {
				this.examId = option.id
			}
			if (option.type == 'answered') {
				this.pageType = 1
				this.getAnsweredDetail()
			} else if (option.type == 'view') {
				this.pageType = 2
				this.getExamDetail()
				this.answerOver = true
			} else {
				this.getExamDetail()
			}
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop
		},
		methods: {
			// 删除答题记录
			deleteHistory() {
				uni.showModal({
					title: "提示",
					content: this.pageType == 1 ? "是否要删除该答题记录" : "是否要删除该试卷",
					success: (res) => {
						if (res.confirm) {
							let url = this.pageType == 1 ? 'remove/answerHistory' : 'remove/myExam'
							this.$http.request(url, {
								id: this.examId
							}).then(res => {
								this.toast(res.msg, 'success')
								setTimeout(() => {
									this.navigaBack()
									if (this.pageType == 1) {
										uni.$emit('examReply')
									} else if (this.pageType == 2) {
										uni.$emit('myExam')
									}
								}, 1500)
							})
						}
					}
				})
			},
			getAnsweredDetail() {
				let params = {
					id: this.examId
				}
				this.$http.request('get/getReplyDetail', params).then(res => {
					let data = res.data
					this.examShow = true
					this.answerOver = true
					this.examInfo = data.info
					this.score = data.score
					this.interviewList = data.topic
					this.answererInfo = data.answerer
					this.answerTime = dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss')
				})
			},
			// 显示答案
			showAnswer(index) {
				console.log("show------>", index);
				this.interviewList[index].show = !this.interviewList[index].show
			},
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
				this.$http.request('get/getExamDetail', params).then(res => {
						console.log(res);
						if (res.data.endTime < dayjs().format("YYYY-MM-DD") && this.pageType == 0) {
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
							item.show = false
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
					.catch(res => {
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
						setTimeout(() => {
							uni.reLaunch({
								url: '/pages/index/index'
							})
						}, 1500)
						return
					})
			},
			// 倒计时
			intervalTime() {
				let time = this.examInfo.limitTime * 60
				this.surplusTime = 0
				this.surplusTimeInterval = setInterval(() => {
					this.surplusTime += 1
					if (this.surplusTime >= time) {
						clearInterval(this.surplusTimeInterval)
						this.submitAnswer(false)
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
			submitAnswer(check = true) {
				if (check) {
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
				}
				this.checkAnswerRight()
				let params = {
					info: this.examInfo,
					score: this.score,
					topic: this.interviewList
				}
				this.$http.request('add/answerResult', params).then(res => {
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
			/* 
			 * 创建海报分享图
			 */
			// 获取图片信息
			getImageInfo(image, key) {
				return new Promise((resolve, reject) => {
					uni.getImageInfo({
						src: image,
						success: (res) => {
							console.log('70--->', res);
							if (key == 'cover') {
								this.coverWidth = res.width
								this.coverHeight = res.height
							}
							this[key] = res.path
							resolve(res)
						},
						fail: (res) => {
							reject(res)
						}
					})
				})
			},
			// 初始化分享图的数据
			async initQRcode() {
				if (this.poster) {
					this.createSuccessPop = true
					return
				}
				this.canvasWidth = 670
				this.canvasHeight = 940

				let coverList = uni.getStorageSync('shareCover').cover
				let coverIndex = Math.floor((Math.random() * coverList.length))
				let cover = coverList[coverIndex]

				let descList = uni.getStorageSync('shareCover').desc
				let descIndex = Math.floor((Math.random() * descList.length))
				this.codeDesc = descList[descIndex]

				await this.getImageInfo(this.examInfo.qrcode, 'code')
				await this.getImageInfo(cover, 'cover')
				await this.getImageInfo(this.userInfo.avatarUrl, 'avatar')
				uni.showLoading({
					title: "生成中...",
					mask: true
				})
				this.initCanvas()
			},
			// 开始绘图
			initCanvas() {
				let userInfo = this.userInfo
				let width = this.canvasWidth
				let height = this.canvasHeight
				var ctx = uni.createCanvasContext('qrcode')
				// 绘制背景色
				ctx.fillStyle = "#fff"; // 设置或返回用于填充绘画的颜色、渐变或模式
				ctx.fillRect(0, 0, width, height);
				// 背景图
				ctx.save();
				ctx.beginPath();
				ctx.rect(0, 0, width, width)
				ctx.clip();
				ctx.drawImage(this.cover, 0, 0, width, width / this.coverWidth * this.coverHeight);
				ctx.restore();

				ctx.drawImage(this.code, width - 180, height - 180, 160, 160)
				// 标题
				ctx.fillStyle = "#333"; // 设置或返回用于填充绘画的颜色、渐变或模式
				ctx.setFontSize(30)
				ctx.save();
				ctx.fillText(this.examInfo.title, 20, width + 40);
				ctx.restore();

				// 用户名字
				ctx.fillStyle = "#333"; // 设置或返回用于填充绘画的颜色、渐变或模式
				let name = userInfo.nickName
				ctx.setFontSize(24)
				ctx.save();
				ctx.fillText(name, 152, height - 120);
				ctx.restore();

				// 用户下的描述
				ctx.fillStyle = "#666"; // 设置或返回用于填充绘画的颜色、渐变或模式
				ctx.setFontSize(22)
				ctx.save();
				ctx.fillText(this.codeDesc, 152, height - 84);
				ctx.restore();

				// 用户下的描述2
				ctx.fillStyle = "#999"; // 设置或返回用于填充绘画的颜色、渐变或模式
				ctx.setFontSize(20)
				ctx.save();
				ctx.fillText('长按小程序码，识别了解详情>>', 152, height - 52);
				ctx.restore();

				// 用户头像
				ctx.save();
				ctx.beginPath();
				ctx.arc(120 / 2 + 20, 120 / 2 + 784, 120 / 2, 0, Math
					.PI * 2, false);
				ctx.clip();
				ctx.drawImage(this.avatar, 20, 784, 120, 120);
				ctx.restore();

				ctx.draw(false, () => {
					this.translateImage()
				})
			},
			// 把canvas转成图片
			translateImage() {
				uni.canvasToTempFilePath({
					x: 0,
					y: 0,
					width: this.canvasWidth,
					height: this.canvasHeight,
					destWidth: this.canvasWidth,
					destHeight: this.canvasHeight,
					canvasId: 'qrcode',
					success: (res) => {
						console.log('------->', res);
						this.poster = res.tempFilePath
						this.createSuccessPop = true
						uni.hideLoading()
					},
					fail: (res) => {
						console.log('fail----->', res);
						setTimeout(() => {
							this.translateImage()
						}, 300)
					}
				})
			},
			// 保存二维码
			saveCodeImage() {
				uni.saveImageToPhotosAlbum({
					filePath: this.poster,
					success: (res) => {
						uni.showToast({
							title: "保存成功!"
						})
					},
					fail: (res) => {
						uni.showToast({
							title: "保存失败!",
							icon: "none"
						})
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	#qrcode {
		position: absolute;
		top: -1000vh;
		left: -1000vw;
	}

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

	.float-btn {
		width: 68rpx;
		height: 68rpx;
		position: fixed;
		right: 30rpx;
		bottom: 40rpx;

		image {
			width: 68rpx;
			height: 68rpx;
		}
	}

	.exam-page {
		.answer-info {
			padding: 30rpx;
			width: 640rpx;
			height: 500rpx;
			box-shadow: 0 0 12rpx rgba(0, 0, 0, 0.08);
			box-sizing: border-box;

			&__title {
				width: 100%;
				text-align: center;
				font-size: 32rpx;
				font-weight: bold;
				margin-bottom: 50rpx
			}

			&__block {
				margin-bottom: 20rpx;
				display: flex;
				align-items: center;

				&__title {
					width: 200rpx;
					text-align: end;
					font-size: 30rpx;
				}

				&__text {
					font-size: 28rpx;
					white-space: nowrap;
				}

				&__time {
					color: #999;
					font-size: 28rpx;
				}

				&__right {
					color: #35B128;
				}

				&__wrong {
					color: #ff3b20;
				}
			}
		}

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

			image {
				height: 40rpx;
				position: relative;
				top: 6rpx;
				margin-left: 20rpx;
			}
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
