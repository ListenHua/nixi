<template>
	<view v-if="topicInfo">
		<view class="topic-info">
			<topic-item :item="topicInfo" :button="[]" :customStyle="{'box-shadow':'none'}"></topic-item>
		</view>
		<view class="analysis-box">
			<view class="analysis-title">题目解析</view>
			<view class="analysis-list">
				<view class="analysis-block" :class="[item.className]" v-for="item in analysisList">
					<view class="user-info" v-if="item.author">
						<image class="head" :src="item.author.avatarUrl" mode="aspectFill"></image>
						<view class="info-box">
							<text class="name">{{item.author.nickName}}</text>
							<text class="time">{{item.createTime}}</text>
						</view>
					</view>
					<view class="analysis-block__content">{{item.content}}</view>
				</view>
				<u-empty v-if="analysisList.length==0&&nodata" text="该题暂无解析" mode="data"
					icon="http://cdn.uviewui.com/uview/empty/data.png">
				</u-empty>
			</view>
		</view>
		<n-bottom>
			<view class="analysis-bottom">
				<u-button color="#3478F5" text="添加解析" :customStyle="{width:'168rpx',margin:0}" @click="inputPop=true">
				</u-button>
			</view>
		</n-bottom>
		<u-popup :show="inputPop" closeOnClickOverlay closeable mode="bottom" @close="inputPop=false">
			<view class="textarea-box">
				<textarea v-model="analysisContent" class="textarea-input" maxlength="-1"></textarea>
				<u-button color="#3478F5" text="提交" :customStyle="{width:'168rpx'}" @click="addAnalysis">
				</u-button>
			</view>
		</u-popup>
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
				inputPop: false,
				id: '',
				analysisContent: '',
				analysisList: [],
				topicInfo: '',
				pages: 1,
				nodata: false,
			}
		},
		onLoad(option) {
			this.id = option.id
			this.getData();
			this.init()
		},
		onReachBottom() {
			if (this.nodata) return
			this.pages += 1
			this.getAnalysisList()
			uni.vibrateShort()
		},
		methods: {
			// 初始化数据
			init() {
				this.analysisList = []
				this.pages = 1
				this.nodata = false
				this.getAnalysisList()
			},
			// 获取解析数据
			getAnalysisList() {
				this.$http.request('get/topicAnalysis', {
					page: this.pages,
					limit: 10,
					id: this.id
				}).then(res => {
					let list = res.data
					if (list.length == 0) {
						this.nodata = true
					}
					list.forEach((item, index) => {
						item.createTime = dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss')
						item.className = 'animation' + (index + 1)
						this.analysisList.push(item)
					})
				})
			},
			// 发送解析
			addAnalysis() {
				if (this.analysisContent == '') {
					uni.showToast({
						title: "填写内容不能为空",
						icon: "none"
					})
					return
				}
				let params = {
					id: this.id,
					content: this.analysisContent
				}
				this.$http.request('add/topicAnalysis', params).then(res => {
					this.inputPop = false
					this.analysisContent = ''
					uni.showToast({
						title: res.msg,
					})
					setTimeout(() => {
						this.init()
					}, 1500)
				}).catch(res => {
					uni.showToast({
						title: res.msg,
						icon: "none"
					})
				})
			},
			// 获取数据
			getData() {
				this.$http.request('get/getTopicInfo', {
					id: this.id
				}).then(res => {
					let data = res.data
					data.show = true
					if (data.type !== 2) {
						data.option.map((item, index) => {
							if (data.answer.indexOf(index) == -1) {
								item.right = false
							} else {
								item.right = true
							}
						})
					}
					this.topicInfo = data
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	@for $i from 1 to 16 {
		.animation#{$i} {
			animation: fade-in-right .8s forwards $i*0.2s;
		}
	}

	.textarea-box {
		background-color: #f8f8f8;
		padding: 80rpx;

		.textarea-input {
			width: 100%;
			height: 50vh;
			background-color: #fff;
			border-radius: 16rpx;
			padding: 30rpx;
			box-sizing: border-box;
			margin-bottom: 30rpx;
		}
	}

	.topic-info {
		padding: 0 40rpx;
		opacity: 0;
		animation: text-focus-in .8s forwards 0.3s;
	}

	.analysis-bottom {
		padding: 0 40rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		height: 100%;
	}

	.analysis-box {
		border-top: 2rpx solid #f8f8f8;
		padding: 30rpx;

		.analysis-title {
			font-size: 32rpx;
			position: relative;
			padding-left: 30rpx;

			&::after {
				content: "";
				width: 6rpx;
				height: 28rpx;
				background-color: $color-main;
				position: absolute;
				left: 0;
				top: 0;
				bottom: 0;
				margin: auto 0;
				border-radius: 24rpx;
			}
		}

		.analysis-list {
			.analysis-block {
				margin: 30rpx 0;
				padding-bottom: 30rpx;
				border-bottom: 2rpx solid #ddd;
				opacity: 0;

				&:last-child {
					border: none;
				}

				.user-info {
					display: flex;
					align-items: center;

					.head {
						width: 68rpx;
						height: 68rpx;
						margin-right: 30rpx;
						border-radius: 50%;
					}

					.info-box {
						display: flex;
						flex-direction: column;

						.name {
							font-size: 28rpx;
						}

						.time {
							font-size: 24rpx;
							color: #8a8a8a;
						}
					}
				}

				&__content {
					font-size: 28rpx;
					margin-top: 30rpx;
				}
			}
		}
	}
</style>
