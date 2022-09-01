<template>
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
		<test-view :menuShow="menuShow" :page="pageParams" @switch="switchPage"></test-view>
		<record-view ref="record" :menuShow="menuShow" :page="pageParams" @switch="switchPage"></record-view>
		<database-view :menuShow="menuShow" :page="pageParams" @switch="switchPage"></database-view>
		<interview-view :menuShow="menuShow" :page="pageParams" @switch="switchPage"></interview-view>
		<setting-view :menuShow="menuShow" :page="pageParams" @switch="switchPage">
		</setting-view>
		<main-view :menuShow="menuShow" :page="pageParams" @switch="switchPage"></main-view>
	</view>
</template>

<script>
	import {
		request
	} from '@/utils/request.js'
	import DatabaseView from './components/database.vue'
	import SettingView from './components/setting.vue'
	import RecordView from './components/record.vue'
	import InterviewView from './components/interview.vue'
	import MainView from './components/main.vue'
	import TestView from './components/test.vue'
	export default {
		components: {
			DatabaseView,
			RecordView,
			InterviewView,
			MainView,
			SettingView,
			TestView
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
						title: "浏览记录",
						value: "record"
					},
					{
						title: "设置",
						value: "setting"
					},
				],
				testData: '',
			}
		},
		created() {
			this.pageParams = {
				main: 'main',
				minor: ''
			}
		},
		onLoad() {
			if (uni.getStorageSync('userInfo').role > 0) {
				this.tabList.push({
					title: "实验室",
					value: "test"
				})
			} else {
				uni.$once("userLogin", () => {
					this.tabList.push({
						title: "实验室",
						value: "test"
					})
				})
			}
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
				console.log("params", this.pageParams)
			},
			// 菜单栏操作
			switchFuc(val) {
				if (val == 'record') this.$refs.record.refresh()
				this.switchPage(val)
			},
		}
	}
</script>

<style lang="scss" scoped>
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
