<template>
	<view>
		<view class="special">
			<view class="special-card" :class="[item.className]" v-for="(item,index) in specialList" :key="index"
				@click="navigateTo('/pages/modules/simulation/scene')">
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
				specialList: [{
					icon: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-54f1765b-5282-47cf-8405-d6f9ccf838c3/7a48469a-6b12-4737-ae5b-fb9fa2a56a0d.gif',
					logo: "",
					title: "前端专题",
					descript: "原型链，继承，作用域，闭包，变量提升，this的指向，立即执行函数等前端知识模拟面试"

				}, {
					icon: 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-54f1765b-5282-47cf-8405-d6f9ccf838c3/bf2b15c4-d948-46e9-927c-f1addee255eb.gif',
					logo: "",
					title: "Java专题",
					descript: "原型链，继承，作用域，闭包，变量提升，this的指向，立即执行函数等前端知识模拟面试"

				}]
			}
		},
		onLoad() {
			this.specialList.map((item, index) => {
				item.className = `animation${index+1}`
			})
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	@for $i from 1 to 16 {
		.animation#{$i} {
			animation: fade-in-right 1s forwards $i*0.3s;
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
