<template>
	<scroll-view scroll-y :class="['view-content',className]"
		:style="{'height':systemInfo.screenHeight+'px','padding-top':systemInfo.statusBarHeight+50+'px','z-index':zIndex}">
		<view v-if="menuShow" class="blur-layer" @touchmove.stop @click="switchInPage"></view>
		<view class="page-content">
			<view class="user-info">
				<view class="welcome-text">
					<view class="text">Welcome,</view>
					<view class="name text-focus-in" v-if="isLogin">{{userInfo.nickName}}</view>
					<view class="login-text" v-else @click="toLogin">点击登录</view>
				</view>
				<image v-if="isLogin" class="avatar shadow-drop-center" :src="userInfo.avatarUrl"></image>
				<image v-else class="avatar shadow-drop-center" src="/static/images/logo.png" @click="toLogin"></image>
			</view>
			<!-- 资料库 -->
			<view class="info-block" style="overflow: hidden;">
				<view class="info-block__top">
					<view class="info-block__top__title">推荐资料</view>
					<view class="info-block__top__switch" @click="getBookList">换一批</view>
				</view>
				<view class="book-list">
					<view class="book-list__block" v-for="(item,index) in bookList" :key="index"
						@click="viewPage(item.id)">
						<image class="book-list__block__cover" :src="item.cover" mode="aspectFill"></image>
						<view class="book-list__block__title">{{item.title}}</view>
						<view class="book-list__block__author">{{item.author}}</view>
					</view>
				</view>
			</view>
			<!-- 面试题 -->
			
			<view class="info-block">
				<view class="info-block__top">
					<view class="info-block__top__title">面试题</view>
					<view class="info-block__top__switch" @click="getTopicList">换一题</view>
				</view>
				<view v-if="topicData.title" class="interview-block fade-in-bottom">
					<topic-item :item='topicData' @show="showAnswer" @select="selectAnswer"></topic-item>
				</view>
			</view>
		</view>
		<!-- 提示弹窗 -->
		<u-toast ref="uToast" />
	</scroll-view>
</template>

<script>
	import {
		login,
		request
	} from '@/utils/request.js'
	import topicItem from '@/components/topic-item/topic-item'
	export default {
		components: {
			topicItem
		},
		name: "main",
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
				recommendList: [],
				systemInfo: getApp().globalData.systemInfo,
				isMainPage: false,
				userInfo: {},
				isLogin: false,
				bookList: [],
				topicData: {},
			}
		},
		watch: {
			menuShow(result) {
				this.checkPage()
			},
		},
		mounted() {
			console.log("加载main")
			uni.$once('loginSuccess', () => {
				this.getInfo()
			})
			this.getInfo()
			this.checkPage()
		},
		methods: {
				// 显示答案
				showAnswer(index) {
					let data = this.topicData
					this.topicData.show = !this.topicData.show
					this.topicData.answered = true
					if (data.type !== 2 && !data.wrong) {
						data.option.forEach(item => {
							if (item.check != item.right) {
								this.topicData.wrong = true
								uni.vibrateShort()
							}
						})
					}
				},
				// 选择答案
				selectAnswer(index, i) {
					let data = this.topicData
					let type = data.type
					if (data.answered) return
					if (type === 0) {
						this.topicData.option.map(item => {
							item.check = false
						})
						this.topicData.option[i].check = true
					} else if (type === 1) {
						this.topicData.option[i].check = !this.topicData.option[i].check
					}
			
				},
			// 去详情
			viewPage(id) {
				uni.navigateTo({
					url: `/pages/detail/viewDetail?id=${id}`
				})
			},
			// 去登录
			toLogin() {
				uni.navigateTo({
					url: '/pages/login/login'
				})
			},
			// 获取用信息
			async getInfo() {
				await login()
				let info = uni.getStorageSync('userInfo')
				if (info) {
					this.userInfo = info
					this.isLogin = true
				}
				this.getTopicList()
				this.getBookList()
			},
			// 获取推荐资料库
			getBookList() {
				this.bookList = []
				request('get/getBookList', {
					random: true,
					size: 3
				}).then(res => {
					let list = res.data
					this.bookList = list
				})
			},
			// 获取题库
			getTopicList() {
				this.topicData = {}
				request('get/getTopicList', {
					random: true
				}).then(res => {
					let list = res.data
					if (list) {
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
						this.topicData = list[0]
					}
				})
			},
			// 页面方法
			checkPage() {
				let params = this.$handle.className(this.menuShow, this.page, 'index')
				this.className = params.class
				this.zIndex = params.zIndex
			},
			switchInPage() {
				this.$emit("switch", 'index')
			},
		}
	}
</script>

<style scoped lang="scss">
	@import url('main.css');
	@import url('@/static/scss/animate.scss');

	.page-content {
		padding: 0 50rpx;

		.user-info {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.welcome-text {
				.text {
					font-size: 60rpx;
					font-weight: bold;
					color: #000;
				}

				.name {
					font-size: 50rpx;
					color: #3c3c3c;
					opacity: 0;
				}

				.login-text {
					font-size: 50rpx;
					color: $color-main;
				}
			}

			.avatar {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
			}
		}

		.info-block {
			margin-top: 60rpx;
			padding-bottom: 60rpx;
			min-height: 400rpx;
			&__top {
				display: flex;
				justify-content: space-between;
				align-items: center;

				&__title {
					font-size: 40rpx;
					font-weight: bold;
					color: #000;
				}

				&__switch {
					font-size: 28rpx;
					color: $color-main;
				}
			}

			.book-list {
				display: flex;
				margin-top: 20rpx;
				justify-content: space-between;

				&__block {
					width: 30%;
					flex-shrink: 0;
					display: flex;
					flex-direction: column;
					// transition: all 1s;
					// transform: translateY(1000px);
					opacity: 0;
					box-sizing: border-box;

					@for $i from 1 to 99 {
						&:nth-child(#{$i}) {
							animation: fade-in-bottom 1s forwards $i*0.1s;
						}
					}

					&__cover {
						width: 100%;
						height: 240rpx;
						border-radius: 16rpx;
						box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
						margin: 0 auto 10rpx auto;
					}

					&__title {
						width: 100%;
						font-size: 26rpx;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}

					&__author {
						width: 100%;
						font-size: 24rpx;
						color: $text-color-gray;
						white-space: nowrap;
						text-overflow: ellipsis;
						overflow: hidden;
					}
				}
			}
			.interview-block{
				margin-top: 20rpx;
			}
		}
	}


	.tracking-in-expand {
		-webkit-animation: tracking-in-expand 1.5s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
		animation: tracking-in-expand 1.5s cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
	}

	.shadow-drop-center {
		-webkit-animation: shadow-drop-center 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
		animation: shadow-drop-center 1s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
	}
	.fade-in-bottom {
		-webkit-animation: fade-in-bottom 1s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
		        animation: fade-in-bottom 1s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	}
	.text-focus-in {
		-webkit-animation: text-focus-in 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
		        animation: text-focus-in 1s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
	}
</style>
