<template>
	<view>
		<view class="special">
			<view class="special-card" :class="[item.className]" v-for="(item,index) in specialList" :key="index"
				@click="navigateTo('/pages/modules/simulation/scene?key='+item.key)">
				<image class="special-card__icon" :src="item.icon" mode="aspectFill"></image>
				<view class="special-card__info">
					<view class="special-card__info-title">{{item.title}}</view>
					<view class="special-card__info-desc">{{item.descript}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				specialList: [],
				nodata: false,
				pages: 1,
			}
		},
		onLoad() {
			this.getData()
		},
		onReachBottom() {
			if (this.nodata) return
			this.pages += 1
			this.getData()
		},
		methods: {
			getData() {
				let params = {
					page: this.pages,
					limit: 15,
				}
				this.$http.request('get/simulationList', params).then(res => {
					let data = res.data
					data.map((item, index) => {
						item.className = `animation${index+1}`
					})
					if (data.length == 0) {
						this.nodata = true
					}
					this.specialList = data
					console.log(res);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@for $i from 1 to 16 {
		.animation#{$i} {
			animation: fade-in-right .5s forwards $i*0.2s;
		}
	}

	.special {
		padding: 40rpx;

		&-card {
			opacity: 0;
			width: 100%;
			overflow: hidden;
			border-radius: 20rpx;
			box-shadow: 4rpx 4rpx 24rpx rgba(0, 0, 0, 0.16);
			position: relative;
			margin-bottom: 50rpx;

			&__icon {
				width: 100%;
				height: calc((100vw - 80rpx)/4*3);
			}

			&__info {
				padding: 0 30rpx 30rpx;
				box-sizing: border-box;

				&-title {
					font-size: 50rpx;
					font-weight: bold;
					color: #000;
					margin-top: 20rpx;
				}

				&-desc {
					margin-top: 10rpx;
					font-size: 28rpx;
					color: #999;
				}
			}
		}
	}
</style>
