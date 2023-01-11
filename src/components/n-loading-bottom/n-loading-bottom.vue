<template>
	<view class="n-loading-bottom">
		<view class="n-loading-bottom__block" v-if="show">
			<view v-for="item in 6"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "n-loading-bottom",
		props: {
			show: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style scoped lang="scss">
	.n-loading-bottom {
		width: 100%;
		height: 48rpx;
		position: relative;
		padding: 30rpx 0;

		&__block {
			width: 100%;
			height: 48rpx;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;

			view {
				width: 12rpx;
				height: 48rpx;
				background-image: linear-gradient(to bottom, $color-main, $color-second);
				border-radius: 8rpx;
				margin: 0 4rpx;

				@for $i from 1 to 7 {
					&:nth-child(#{$i}) {
						animation: shrink 1.8s infinite $i*0.14s;
					}
				}
			}
		}
	}

	@keyframes shrink {
		50% {
			height: 50%;
		}
	}
</style>
