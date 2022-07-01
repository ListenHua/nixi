<template>
	<view class="page-content"
		:style="{'height':systemInfo.screenHeight+'px','background-image':backgroundImg?'url('+backgroundImg+')':''}">
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
		<Setting :menuShow="menuShow" :page="pageParams" @switch="switchPage" @changeBg="changeBackground"></Setting>
		<Record ref="record" :menuShow="menuShow" :page="pageParams" @switch="switchPage"></Record>
		<Recommend :menuShow="menuShow" :page="pageParams" @switch="switchPage"></Recommend>
	</view>
</template>

<script>
	import Recommend from './components/recommend.vue'
	import Setting from './components/setting.vue'
	import Record from './components/record.vue'
	export default {
		components: {
			Recommend,
			Setting,
			Record
		},
		data() {
			return {
				pageParams: {
					main: '',
					minor: ''
				},
				backgroundImg: '',
				searchValue: '',
				menuShow: false,
				systemInfo: getApp().globalData.systemInfo,
				tabList: [{
						title: "首页",
						value: "index"
					},
					// {
					// 	title: "资料库",
					// 	value: ""
					// },
					// {
					// 	title: "面试题",
					// 	value: ""
					// },
					{
						title: "浏览记录",
						value: "record"
					},
					// {
					// 	title: "我的",
					// 	value: ""
					// },
					{
						title: "设置",
						value: "setting"
					}
				],
			}
		},
		created() {
			let background = uni.getStorageSync('backgroundImage')
			this.backgroundImg = background
			this.pageParams = {
				main: 'index',
				minor: ''
			}
		},
		onLoad() {},
		onShareAppMessage() {

		},
		onShow() {
			this.$refs.record.refresh()
		},
		methods: {
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
			},
			// 菜单栏操作
			switchFuc(val) {
				if (val == 'record') this.$refs.record.refresh()
				this.switchPage(val)
			},
			// 改变背景图
			changeBackground(url) {
				this.backgroundImg = url
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-content {
		width: 100%;
		position: relative;
		background: linear-gradient(to right, $color-main, $color-second, $color-shallow);
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
			box-shadow: 8rpx 8rpx 12rpx rgba(0, 0, 0, 0.16);
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
				box-shadow: 8rpx 8rpx 12rpx rgba(255, 255, 255, 0.16);
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
				text-shadow: 0 0 24rpx $text-color-main;
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
