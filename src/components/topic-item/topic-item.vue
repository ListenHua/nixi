<template>
	<view class="interview-block" :class="item.wrong?'shake-horizontal':''" :style="[customStyle]">
		<view class="interview-block__info">
			<text class="interview-block__info__type">「{{item.type===0?'多选':item.type===1?'单选':'问答题'}}」</text>
			<text class="interview-block__info__tag"
				:style="{'background-color':item.level===0?'#7bcfa6':item.level===1?'#71a0f8':'#3478F5'}">{{item.level===0?'初级':item.level===1?'中级':'高级'}}</text>
			<view class="interview-block__info__tag" v-for="(items,index) in item.label">{{items}}</view>
		</view>
		<view class="interview-block__title">
			<n-html :content='item.title'></n-html>
		</view>
		<!-- 选项或答案区 -->
		<template v-if="answer">
			<!-- 多选 -->
			<view class="interview-block__checkbox" v-if="item.type===0">
				<view class="interview-block__option" :class="[answerShowClass(item,items)]"
					v-for="(items,i) in item.option" @click="selectAnswer(index,i)">
					<n-html :content='items.content'></n-html>
				</view>
			</view>
			<!-- 单选 -->
			<view class="interview-block__checkbox" v-else-if="item.type===1">
				<view class="interview-block__option" :class="[answerShowClass(item,items)]"
					v-for="(items,i) in item.option" @click="selectAnswer(index,i)">
					<n-html :content='items.content'></n-html>
				</view>
			</view>
			<!-- 答案 -->
			<view class="interview-block__text" v-else-if="item.type===2" v-show="item.show">
				<view class="interview-block__text__content">
					<n-html :content='item.answer'></n-html>
				</view>
			</view>
		</template>
		<view class="interview-block__bottom">
			<template v-if="button.includes('study')">
				<view class="interview-block__bottom__button" v-if="item.type===2&&!item.show"
					@click="showAnswer(index)">
					<text>查看答案</text>
				</view>
				<view class="interview-block__bottom__button" v-if="item.type!==2" @click="showAnswer(index)">
					<text>{{item.show?'我的选择':'查看答案'}}</text>
				</view>
				<view class="interview-block__bottom__button blue-btn" v-if="item.type!==2" @click="viewAnalysis(item)">
					<text>查看解析</text>
				</view>
			</template>
			<view v-if="button.includes('join')" class="interview-block__bottom__button green-btn"
				@click="join(item,index)">
				<text>加入题库</text>
			</view>
			<view v-if="button.includes('remove')" class="interview-block__bottom__button red-btn"
				@click="remove(item,index)">
				<text>移出题库</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "topic-item",
		props: {
			item: {
				type: Object,
				default: () => {}
			},
			index: {
				type: Number,
				default: 0,
			},
			button: {
				type: Array,
				default: ['study']
			},
			answer: {
				type: Boolean,
				default: true,
			},
			customStyle: {
				type: [Object, String],
				default: () => {}
			}
		},
		computed: {
			answerShowClass(item, items) {
				return (item, items) => {
					let ary = []
					if (!item.show && item.wrong && items.check) {
						ary.push('interview-block__wrong')
					} else if (!item.show && items.check) {
						ary.push('interview-block__select')
					}
					if (item.show && items.right) {
						ary.push('interview-block__answer')
					}

					return ary
				}
			}
		},
		data() {
			return {

			};
		},
		mounted() {},
		methods: {
			// 查看题目分析
			viewAnalysis(item) {
				uni.navigateTo({
					url: '/pages/topic/analysis?id=' + item._id
				})
			},
			showAnswer(index) {
				this.$emit('show', index)
			},
			selectAnswer(index, i) {
				this.$emit('select', index, i)
			},
			remove(item, index) {
				this.$emit('remove', item, index)
			},
			join(item, index) {
				this.$emit('join', item, index)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.interview-block {
		box-shadow: 0 10rpx 24rpx rgba(0, 0, 0, 0.08);
		border-radius: 16rpx;
		margin-bottom: 30rpx;
		padding: 30rpx;

		&__info {
			display: flex;
			flex-wrap: wrap;
			align-items: center;

			&__type {
				margin-bottom: 10rpx;
				font-size: 30rpx;
			}

			&__tag {
				padding: 8rpx 16rpx;
				border-radius: 8rpx;
				background-color: rgba(52, 120, 245, 0.5);
				margin-left: 10rpx;
				margin-bottom: 10rpx;
				font-size: 24rpx;
				color: #fff;
			}
		}

		&__title {
			font-size: 32rpx;
			margin-bottom: 30rpx;
		}

		&__option {
			font-size: 28rpx;
			background-color: #f8f8f8;
			border-radius: 16rpx;
			padding: 20rpx;
			margin-top: 16rpx;
		}

		&__select {
			background-color: rgba(52, 120, 245, 0.2);
		}

		&__wrong {
			background-color: rgba(255, 59, 43, 0.2);
		}

		&__answer {
			background-color: rgba(62, 179, 112, 0.2);
		}

		&__text {
			font-size: 28rpx;
			background-color: #f8f8f8;
			border-radius: 16rpx;
			padding: 20rpx;
		}

		&__bottom {
			display: flex;
			justify-content: flex-end;
			align-items: center;
			margin-top: 30rpx;

			&__button {
				background-color: #3eb370;
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 12rpx 30rpx;
				border-radius: 8rpx;
				color: #fff;
				font-size: 26rpx;
				margin-left: 20rpx;
			}

			.red-btn {
				background-color: #ff3030;
			}

			.green-btn {
				background-color: #3eb370;
			}

			.blue-btn {
				background-color: #71a0f8;
			}

			&__icon {
				width: 24rpx;
				height: 24rpx;
				margin-right: 16rpx;
			}
		}
	}

	.shake-horizontal {
		-webkit-animation: shake-horizontal 500ms cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
		animation: shake-horizontal 500ms cubic-bezier(0.455, 0.030, 0.515, 0.955) both;
	}
</style>
