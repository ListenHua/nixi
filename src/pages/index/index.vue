<template>
	<view>
		<view class="start-page" :class="[pageLoad?'hide-start-page':'']">
			<n-loading-page v-if="!startParams.cover"></n-loading-page>
			<image :src="startParams.cover" mode="aspectFill" @click="startClick"></image>
		</view>
		<view class="page-content"
			:style="{'height':systemInfo.screenHeight+'px','background-image':userInfo.background?'url('+userInfo.background+')':''}">
			<view :class="['menu-btn',menuShow?'':'no-shadow']" @click="menuShow=!menuShow"
				:style="{'top':systemInfo.statusBarHeight+6+'px'}">
				<view :class="['line',menuShow?'show':'']"></view>
				<view :class="['line',menuShow?'show':'']"></view>
				<view :class="['line',menuShow?'show':'']"></view>
			</view>
			<view class="menu-list" :style="{'top':systemInfo.statusBarHeight+40+'px'}">
				<view v-for="(item,index) in tabList" :class="['block',menuShow?'show':'']" :key="index"
					@click="switchFuc(item.value)">{{item.title}}
				</view>
			</view>
			<record-view ref="record" :menuShow="menuShow" :page="pageParams" @switch="switchPage"></record-view>
			<database-view :menuShow="menuShow" :page="pageParams" @switch="switchPage"></database-view>
			<interview-view :menuShow="menuShow" :page="pageParams" @switch="switchPage"></interview-view>
			<main-view :menuShow="menuShow" :page="pageParams" @switch="switchPage"></main-view>
		</view>
	</view>
</template>

<script>
	import DatabaseView from './components/database.vue'
	import RecordView from './components/record.vue'
	import InterviewView from './components/interview.vue'
	import MainView from './components/main.vue'
	export default {
		components: {
			DatabaseView,
			RecordView,
			InterviewView,
			MainView
		},
		data() {
			return {
				pageParams: {
					main: '',
					minor: ''
				},
				searchValue: '',
				menuShow: false,
				systemInfo: getApp().globalData.systemInfo,
				tabList: [{
						title: "首页",
						value: "main"
					},
					{
						title: "资料库",
						value: "database"
					},
					{
						title: "面试题",
						value: "interview"
					},
					{
						title: "模拟面试",
						value: "simulation"
					},
					{
						title: "浏览记录",
						value: "record"
					},
				],
				testData: '',
				startParams: '',
				pageLoad: false,
			}
		},
		created() {
			this.pageParams = {
				main: 'main',
				minor: ''
			}
		},
		onShow() {
			const updateManager = uni.getUpdateManager()
			// 请求完新版本信息的回调
			updateManager.onCheckForUpdate(res => {
				console.log('更新信息', res);
				if (res.hasUpdate) {
					// 新版本下载成功
					updateManager.onUpdateReady(() => {
						uni.showModal({
							title: '小程序已更新',
							content: '点击确定重启小程序',
							success(res) {
								if (res.confirm) {
									// 新的版本已经下载好，强制更新
									updateManager.applyUpdate()
								}
							}
						})
					})
				}
			})
			// 新版本下载失败
			updateManager.onUpdateFailed(res => {
				console.error(res)
			})
		},
		onLoad() {
			this.getStartPage()
		},
		methods: {
			// 点击启动页
			startClick() {
				let path = this.startParams.path
				if (path) {
					uni.navigateTo({
						url: path,
					});
				}
			},
			// 获取启动页
			getStartPage() {
				this.$http.request('get/systemData', {
					type: 'start-page'
				}).then(res => {
					this.startParams = res.data
					setTimeout(() => {
						this.pageLoad = true
					}, 3000)
				}).catch(res => {
					this.pageLoad = true
				})
			},
			// 切换页面
			switchPage(page) {
				let params = this.pageParams
				if (params.main != page && page) {
					let obj = {
						main: page,
						minor: params.main
					}
					this.pageParams = obj
				}
				this.menuShow = false
				console.log("params", this.pageParams)
			},
			// 菜单栏操作
			switchFuc(val) {
				// 查看历史浏览刷新数据
				if (val == 'record') this.$refs.record.refresh()
				// 跳转去模拟面试
				if (val == 'simulation') {
					this.navigateTo('/pages/modules/simulation/index')
					return
				}
				this.switchPage(val)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.hide-start-page {
		animation: slide-out-bck-center 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both;
	}

	.start-page {
		width: 100%;
		height: 100vh;
		position: fixed;
		z-index: 9999;
		background-color: #fff;

		image {
			width: 100%;
			height: 100%;
		}
	}

	.page-content {
		width: 100%;
		position: relative;
		background: linear-gradient(to right, $color-main, #4364f7, #6fb1fc);
		background-position: center;
		background-size: cover;
		background-clip: content-box;
		background-repeat: no-repeat;

		.no-shadow {
			box-shadow: none !important;
		}

		.menu-btn {
			position: fixed;
			left: 60rpx;
			width: 30px;
			height: 30px;
			background-color: rgba(255, 255, 255, 0.1);
			backdrop-filter: blur(10px);
			border-radius: 50%;
			box-shadow: 8rpx 8rpx 12rpx rgba(0, 0, 0, 0.08);
			z-index: 99;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			transition: all .5s;

			.line {
				margin: 1px;
				width: 15px;
				height: 2px;
				border-radius: 8px;
				background-color: $text-color-main;
				transition: all .5s;
				box-shadow: 8rpx 8rpx 12rpx rgba(255, 255, 255, 0.08);
			}

			.show {
				background-color: $color-white;

				&:nth-child(1) {
					transform: translateY(4px) translateX(0rpx) rotate(45deg);
				}

				&:nth-child(2) {
					opacity: 0;
				}

				&:nth-child(3) {
					transform: translateY(-4px) translateX(0rpx) rotate(-45deg);
				}
			}
		}

		.menu-list {
			position: absolute;
			left: 40rpx;

			.block {
				font-weight: bold;
				font-size: 32rpx;
				color: $color-white;
				position: absolute;
				top: 0;
				white-space: nowrap;
				transition: all .5s;
				opacity: 0;
			}

			.show {
				@for $i from 1 to 99 {
					&:nth-child(#{$i}) {
						transform: translateY($i*80rpx);
						transition-delay: $i*0.2;
						opacity: 1;
					}
				}
			}
		}
	}
</style>
