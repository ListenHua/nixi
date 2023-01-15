<template>
	<view>
		<!-- 面试场景 -->
		<image class="top-image" :src="topImage" mode="aspectFill" @click="skip"></image>
		<view class="question" v-if="talker=='hr'">
			<text class="talk-text">{{talkText}}</text>
			<view class="question__bottom" v-if="buttonText">
				<n-button width="160rpx" height="68rpx" fontSize="24" @click="next"
					:customStyle="{animation: 'fade-in 0.5s forwards'}">{{buttonText}}</n-button>
			</view>
		</view>
		<view class="answer" v-if="talker=='me'">
			<template v-if="startAnswer">
				<textarea v-model="answerText" auto-focus auto-height></textarea>
				<view class="question__bottom">
					<n-button width="160rpx" height="68rpx" fontSize="24" @click="submit">提交</n-button>
				</view>
			</template>
			<text class="talk-text" v-else>{{talkText}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				topImage: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-54f1765b-5282-47cf-8405-d6f9ccf838c3/fa3266c9-0499-407a-bb21-910d8354e4f4.gif',
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
			}
		},
		onLoad(option) {
			if (!uni.getStorageSync('viewSimulation')) {
				this.interviewTalk.push({
					text: "模拟面试只有问答题，是否需要填写视自己情况而定，最终提交后可以在“我的-模拟历史”查看相应的模拟面试记录",
					talker: "hr",
					type: "talk",
					button: "我知道了",
					speed: 50,
				})
			}
			let ary;
			if (option.id == 1) {
				ary = [{
					text: "请你简述一下v-model的原理",
					talker: "hr",
					type: "ask",
					button: "回答",
					speed: 100,
				}, {
					text: "请你解释一下instanceof原理",
					talker: "hr",
					type: "ask",
					button: "回答",
					speed: 100,
				}, {
					text: "请你说一下apply和call的作用及区别",
					talker: "hr",
					type: "ask",
					button: "回答",
					speed: 100,
				}]
			} else {
				ary = [{
					text: "golang 中 make 和 new 的区别？",
					talker: "hr",
					type: "ask",
					button: "回答",
					speed: 100,
				}, {
					text: "数组和切片的区别",
					talker: "hr",
					type: "ask",
					button: "回答",
					speed: 100,
				}, {
					text: "for range 的时候它的地址会发生变化么？",
					talker: "hr",
					type: "ask",
					button: "回答",
					speed: 100,

				}]
			}
			this.interviewTalk = this.interviewTalk.concat(ary)
			setTimeout(() => {
				this.talkTo()
			}, 1000)
		},
		methods: {
			// 模拟开场
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
				console.log(data[step]);
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
				let ary = ['不清楚', '不知道', '不懂']
				let answer = this.answerText

				// 判断是否已结束
				if (this.interviewStep == this.interviewTalk.length - 1) {
					this.interviewTalk.push({
						text: "感谢您本次的面试",
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
							text: "好的，没关系，后面可以了解一下",
							talker: "hr",
							type: "talk",
						})
						return
					}
				}

				console.log('step.length', this.interviewStep, this.interviewTalk.length);
				console.log('boolean', this.interviewStep == this.interviewTalk.length - 1);
				this.answerText = ''
				this.interviewStep += 1
				this.talkTo()
			},
			// 制作打字效果
			typeingText(data) {
				this.resetTalk()
				this.talking = true
				this.talker = data.talker
				let text = data.text.split('')
				let speed = data.speed ? data.speed : 100
				let delay = text.length > 20 ? 5000 : 1500
				/* 测试时的速度 */
				// let speed = 0
				// let delay = 0
				// 为了等待对话框动画加载
				setTimeout(() => {
					text.forEach((item, index) => {
						// 一个个字符拼接，生成打字效果
						setTimeout(() => {
							this.talkText += item
						}, speed * index)
					})
				}, 500)
				// 如有按钮文本等待字体加载完后显示按钮
				setTimeout(() => {
					this.talking = false
					this.buttonText = data.button
				}, speed * text.length + 600)

				// 谈话模式并且无按钮
				if (data.type == 'talk' && !data.button) {
					setTimeout(() => {
						this.interviewStep += 1
						this.talkTo()
					}, (speed * text.length) + 3000)
				}
				// 额外的对话
				// if (data.type == 'extra') {
				// 	setTimeout(() => {
				// 		this.interviewStep += 1
				// 		this.talkTo()
				// 	}, (speed * text.length) + 3000)
				// }
			},
			// 跳过前置对话
			skipTalk() {

			},
		}
	}
</script>

<style lang="scss" scoped>
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

	.question,
	.answer {
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
		animation: caret .5s steps(1) infinite;
	}

	@keyframes caret {
		50% {
			border-right-color: #000
		}
	}
</style>
