<template>
	<view class="loading-page">
		<view class="loading-block">
			<template v-if="image">
				<image class="loading-block__image" :src="image" mode="widthFix"></image>
			</template>
			<template v-else>
				<view class="loading-block__block" v-for="(item,index) in 7" :key="index"></view>
			</template>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			image: {
				type: String,
				default: 'http://43.138.147.182/images/loading.gif',
			}
		},
		name: "loading-page",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	@keyframes shrink {
		50% {
			height: 30rpx
		}
	}

	.loading-page {
		width: 100%;
		height: 100vh;
		position: fixed;
		left: 0;
		top: 0;
		z-index: 996;
		background-color: #fff;

		.loading-block {
			background-color: #fff;
			position: absolute;
			width: 100%;
			height: 150rpx;
			top: 40%;
			text-align: center;
			display: flex;
			align-items: center;
			justify-content: center;

			&__image {
				width: 80vw;
				height: 80vw;
			}

			&__video {
				width: 500rpx;
				height: 400rpx;
			}

			&__block {
				width: 20rpx;
				height: 150rpx;
				border-radius: 6rpx;
				margin: 0 10rpx;
				background-image: linear-gradient(to bottom, #3b46f1, #4f58f2);

				// background-color: #3b46f1;
				&:nth-child(2n) {
					background-image: linear-gradient(to top, #3b46f1, #4f58f2);
					// background-color: #4f58f2;
				}

				@for $i from 1 to 8 {
					&:nth-child(#{$i}) {
						animation: shrink 1.5s infinite $i*0.1s;
					}
				}

			}
		}

		image {
			width: 100%;
			height: 100%;
		}
	}
</style>
