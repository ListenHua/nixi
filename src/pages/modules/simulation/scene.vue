<template>
	<view>
		<!-- 面试场景 -->
		<image class="top-image" :src="simulationConfig.top_image" mode="aspectFill"></image>
		<view class="question" v-if="talker=='hr'">
			<text class="talk-text">{{talkText}}</text>
			<view class="question__bottom" v-if="buttonText">
				<n-button width="160rpx" height="68rpx" fontSize="24" @click.stop="next"
					:customStyle="{animation: 'fade-in 0.5s forwards'}">{{buttonText}}</n-button>
			</view>
		</view>
		<view class="answer" v-if="talker=='me'">
			<template v-if="startAnswer">
				<textarea v-model="answerText" auto-focus auto-height placeholder="如心有答案,可空白提交"></textarea>
				<view class="question__bottom">
					<n-button width="160rpx" height="68rpx" fontSize="24" @click.stop="submit">提交</n-button>
				</view>
			</template>
			<text class="talk-text" v-else>{{talkText}}</text>
		</view>
		<view class="none" v-if="talker=='none'">
			<text class="talk-text">{{talkText}}</text>
		</view>
		<view class="skip-layer" @click="skipTalk"></view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				simulationConfig: '',
				talking: false, // 是否正在谈话
				talker: '', // 正在说话的人物
				talkText: '', // 说话的内容
				answerText: '', // 输入的回答内容
				buttonText: '', // 按钮文本
				startAnswer: false, // 是否在回答

				interviewStep: 0, // 进行的步骤
				// 谈话列表数据
				interviewTalk: [{
					text: "你好，欢迎来到模拟面试",
					talker: "hr",
					type: "talk",
					button: "",
					speed: 100,
				}, {
					text: "你好，面试官",
					talker: "me",
					type: "talk",
					button: "",
					speed: 100,
				}],
				interviewLoading: true,
				// 打字机定时器
				typeingInterval: '',
				typeingOverInterval: '',
				dialogTimeout: '',
				// 快速谈话
				nextLoading: false,
				skipTimeout: '',
			}
		},
		onLoad(option) {
			this.simulationConfig = uni.getStorageSync('simulationConfig')
			// if (!uni.getStorageSync('viewSimulation')) {
			// 	this.interviewTalk.push({
			// 		text: "模拟面试只有问答题，是否需要填写视自己情况而定，最终提交后可以在“我的-模拟历史”查看相应的模拟面试记录",
			// 		talker: "hr",
			// 		type: "talk",
			// 		button: "我知道了",
			// 		speed: 50,
			// 	})
			// }
			this.talker = 'none'
			this.talkText = this.simulationConfig.loading_text
			setTimeout(() => {
				this.getTopic(option.key)
			}, 500)
		},
		methods: {
			// 获取模拟试题
			getTopic(key) {
				let params = {
					key
				}
				this.$http.request('get/simulationTopic', params).then(res => {
					let data = res.data
					this.interviewLoading = false
					if (data.length == 0) {
						this.interviewTalk.push({
							text: this.simulationConfig.over_text,
							talker: "hr",
							type: "over",
							button: "结束面试"
						})
					}
					this.interviewTalk = this.interviewTalk.concat(data)
					this.talkTo()
				})
			},
			// 谈话
			talkTo() {
				let data = this.interviewTalk
				let step = this.interviewStep
				this.typeingText(data[step])
			},
			// 重置对话
			resetTalk() {
				this.talker = ''
				this.talkText = ''
				this.buttonText = ''
			},
			// 回答问题
			next() {
				let data = this.interviewTalk
				let step = this.interviewStep
				if (data[step].type == 'talk') {
					this.interviewStep += 1
					uni.setStorageSync('viewSimulation', true)
					this.talkTo()
				} else if (data[step].type == 'ask') {
					this.talker = 'me'
					this.startAnswer = true
				} else if (data[step].type == 'over') {
					this.navigaBack()
				}
			},
			submit() {
				let ary = this.simulationConfig.unknow_key_word
				let answer = this.answerText

				// 判断是否已结束
				if (this.interviewStep == this.interviewTalk.length - 1) {
					this.interviewTalk.push({
						text: this.simulationConfig.over_text,
						talker: "hr",
						type: "over",
						button: "结束面试"
					})
				}

				// 判断是否不清楚
				if (answer.length < 6) {
					let know = true
					ary.forEach(item => {
						if (ary.includes(answer)) {
							know = false
						}
					})
					if (!know) {
						this.answerText = ''
						this.typeingText({
							text: this.simulationConfig.unknow_answer_text,
							talker: "hr",
							type: "talk",
						})
						return
					}
				}

				this.answerText = ''
				this.interviewStep += 1
				this.talkTo()
			},
			// 制作打字效果
			typeingText(data) {
				this.resetTalk()
				this.talking = true
				this.talker = data.talker
				let text = data.text
				let speed = data.speed ? data.speed : 100
				let delay = text.length > 20 ? 5000 : 1500
				// 为了等待对话框动画加载
				this.dialogTimeout = setTimeout(() => {
					let length = text.length
					let position = 0
					this.typeingInterval = setInterval(() => {
						this.talkText = text.substring(0, position)
						position += 1
						if (position > length) {
							clearInterval(this.typeingInterval)
						}
					}, speed)
				}, 500)
				// 如有按钮文本等待字体加载完后显示按钮
				this.typeingOverInterval = setTimeout(() => {
					this.talking = false
					this.buttonText = data.button
					// 谈话模式并且无按钮
					if (data.type == 'talk' && !data.button) {
						this.skipTimeout = setTimeout(() => {
							this.interviewStep += 1
							this.nextLoading = false
							this.talkTo()
						}, 3000)
					}
				}, speed * text.length + 600)

			},
			// 跳过前置对话
			skipTalk() {
				if (this.interviewLoading) return
				let data = this.interviewTalk[this.interviewStep]
				clearTimeout(this.dialogTimeout)
				clearTimeout(this.skipTimeout)
				clearInterval(this.typeingInterval)
				clearTimeout(this.typeingOverInterval)
				if (this.nextLoading) {
					// 谈话模式并且无按钮
					if (data.type == 'talk' && !data.button) {
						this.nextLoading = false
						this.interviewStep += 1
						this.talkTo()
					}
					return
				}
				this.nextLoading = false
				this.talkText = data.text
				this.talking = false
				this.buttonText = data.button
				// 谈话模式并且无按钮
				if (data.type == 'talk' && !data.button) {
					this.nextLoading = true
					this.skipTimeout = setTimeout(() => {
						this.interviewStep += 1
						this.nextLoading = false
						this.talkTo()
					}, 3000)
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.skip-layer {
		position: fixed;
		z-index: -1;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		margin: auto;
	}

	.top-image {
		width: 512rpx;
		height: 324rpx;
		margin: 0 auto;
		display: block;
	}

	.question {
		background: #f1f1f1;

		&::before {
			content: '';
			position: absolute;
			width: 0;
			height: 0;
			border: 24rpx solid transparent;
			border-bottom-color: #f1f1f1;
			left: calc(50% - 120rpx);
			top: -48rpx;
		}

	}

	.answer {
		background: $color-shallow;

		textarea {
			line-height: 1;
			font-size: 28rpx;
			color: #000;
		}

		&::before {
			content: '';
			position: absolute;
			width: 0;
			height: 0;
			border: 24rpx solid transparent;
			border-bottom-color: $color-shallow;
			right: calc(50% - 200rpx);
			top: -48rpx;
		}

	}

	.none {
		background: $color-main;

		.talk-text {
			color: #fff;
			animation: none !important;
		}

		&::before {
			content: '';
			position: absolute;
			width: 0;
			height: 0;
			border: 24rpx solid transparent;
		}
	}

	.question,
	.answer,
	.none {
		width: 80%;
		font-size: 32rpx;
		padding: 30rpx;
		border-radius: 8rpx;
		position: relative;
		margin: 30rpx auto 0 auto;
		animation: scale-in-top 0.5s forwards;

		&__bottom {
			display: flex;
			align-items: center;
			justify-content: flex-end;
			margin-top: 30rpx;
		}
	}

	.talk-text {
		font-size: 28rpx;
		font-weight: 500;
		border-right: 2rpx solid transparent;
		animation: caret 1s steps(1) infinite;
	}

	@keyframes caret {
		50% {
			border-right-color: #000
		}
	}
</style>
