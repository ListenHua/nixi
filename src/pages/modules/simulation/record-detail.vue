<template>
	<view class="page-content">
		<view class="step-list">
			<view class="step-block" v-for="(item,index) in info.data" :key="index">
				<view class="step-block__question">{{item.question}}</view>
				<view class="step-block__content">{{item.answer?item.answer:'无'}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id: '',
				info: [],
			}
		},
		onShareAppMessage() {
			let title = `${this.userInfo.nickName}邀请你查看模拟面试记录`
			return {
				title,
				path: `pages/modules/simulation/record-detail?id=${this.id}`,
				imageUrl: 'https://mp-54f1765b-5282-47cf-8405-d6f9ccf838c3.cdn.bspapp.com/cloudstorage/b259086b-d4d4-41cf-be2c-3d5fcc772e27.png',
			}
		},
		onLoad(option) {
			this.id = option.id
			this.getData()
		},
		methods: {
			// 获取数据
			getData() {
				this.$http.request('get/simulationRecordDetail', {
					id: this.id
				}).then(res => {
					let data = res.data
					this.info = data
					uni.setNavigationBarTitle({
						title: data.simulation.title
					})
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import url('@/static/scss/animate.scss');

	.page-content {
		min-height: 100vh;
	}

	.step-list {
		padding: 0 40rpx 40rpx;

		.step-block {
			padding: 30rpx;
			background-color: #fff;
			border-radius: 16rpx;
			margin-top: 30rpx;
			border-bottom: 2rpx solid #eee;
			opacity: 0;

			@for $i from 1 to 99 {
				&:nth-child(#{$i}) {
					animation: fade-in-right .8s forwards $i*0.1s;
				}
			}

			&__question {
				font-size: 32rpx;
				font-weight: bold;
				color: #000;
			}

			&__content {
				padding: 30rpx 0;
				font-size: 28rpx;

			}
		}
	}
</style>
