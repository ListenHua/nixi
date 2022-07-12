<template>
	<view :class="['view-content',className]"
		:style="{'height':systemInfo.screenHeight+'px','padding-top':systemInfo.statusBarHeight+60+'px','z-index':zIndex}">
		<view v-if="menuShow" class="blur-layer" @touchmove.stop @click="switchInPage"></view>
		<view class="interview-list">
			<topic-item v-for="(item,index) in interviewList" :item='item' :index="index" @show="showAnswer" @select="selectAnswer"></topic-item>
		</view>
		<!-- 提示弹窗 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		request
	} from '@/utils/request.js'
	import topicItem from '@/components/topic-item/topic-item'
	export default {
		components: {
			topicItem
		},
		name: "interview",
		props: {
			menuShow: {
				type: Boolean,
				default: false,
			},
			page: {
				type: Object,
				default: () => {
					main: '';
					minor: ''
				}
			}
		},
		data() {
			return {
				zIndex: 30,
				className: '',
				systemInfo: getApp().globalData.systemInfo,
				interviewList: [],
			}
		},
		watch: {
			menuShow(result) {
				if(this.page.main=='interview'&&this.interviewList.length==0){
					this.getData()
				}
				this.checkPage()
			},
		},
		mounted() {
			console.log("加载interview")
			this.checkPage()
		},
		methods: {
			// 显示答案
			showAnswer(index) {
				let data = this.interviewList[index]
				this.interviewList[index].show = !this.interviewList[index].show
				this.interviewList[index].answered = true
				if (data.type !== 2 && !data.wrong) {
					data.option.forEach(item => {
						if (item.check != item.right) {
							this.interviewList[index].wrong = true
							uni.vibrateShort()
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
				}
				request('get/getTopicList', params).then(res => {
					let list = res.data
					list.map(item => {
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
						return item
					})
					this.interviewList = list
				})
			},
			checkPage() {
				let params = this.$handle.className(this.menuShow, this.page, 'interview')
				this.className = params.class
				this.zIndex = params.zIndex
			},
			switchInPage() {
				this.$emit("switch", 'interview')
			},
		}
	}
</script>

<style scoped lang="scss">
	@import url('main.css');
	@import url('@/static/scss/animate.scss');

	.interview-list {
		padding: 0 40rpx;
	}

</style>
