<template>
	<view class="n-empty" :style="[{marginTop:top}]">
		<image class="n-empty__icon" :src="image"></image>
		<text v-if="!$slots.text" class="n-empty__text">{{text}}</text>
		<slot name="text"></slot>
	</view>
</template>

<script>
	export default {
		name: "n-empty",
		props: {
			text: {
				type: String,
				default: '暂无数据'
			},
			image: {
				type: String,
				default: '/static/images/nodata.svg'
			},
			top: {
				type: String,
				default: '200rpx'
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.n-empty {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;

		&__icon {
			width: 200rpx;
			height: 200rpx;
		}

		&__text {
			margin-top: 30rpx;
			font-size: 28rpx;
			color: $text-color-gray;
			white-space: nowrap;
		}
	}
</style>
