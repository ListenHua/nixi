<template>
	<view>
		<view :style="{height}"></view>
		<view class="n-bottom" :style="{backgroundColor:bgColor,height,}">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		name: "n-bottom",
		props: {
			bgColor: {
				type: String,
				default: "#fff"
			},
			height: {
				type: String,
				default: "128rpx"
			}
		},
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.n-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 99;
		box-shadow: 0 0 24rpx rgba(0, 0, 0, 0.08);
	}
</style>
