<template>
	<view class="n-button" :class="[className]" :style="[style,customStyle]">
		<button class="open-type" :open-type="openType" @getphonenumber="getphonenumber" @getuserinfo="getuserinfo"
			@chooseavatar="chooseavatar" @contact="contact" @opensetting="opensetting" @addgroupapp="addgroupapp"
			@chooseaddress="chooseaddress" @chooseinvoicetitle="chooseinvoicetitle" @subscribe="subscribe"
			@click="click"></button>
		<slot></slot>
	</view>
</template>

<script>
	export default {
		props: {
			width: {
				type: String,
				default: "300rpx"
			},
			height: {
				type: String,
				default: "96rpx"
			},
			radius: {
				type: String,
				default: '8rpx'
			},
			bgColor: {
				type: String,
				default: "#3478F5"
			},
			fontSize: {
				type: Number,
				default: 32
			},
			type: {
				type: String,
				default: ""
			},
			color: {
				type: String,
				default: "#fff"
			},
			customStyle: {
				type: Object,
				default: () => {}
			},
			shape: {
				type: String,
				default: "default"
			},
			openType: {
				type: String,
				default: ""
			},
			className: {
				type: [String, Array],
				default: ''
			}
		},
		name: "n-button",
		data() {
			return {
				style: {}
			};
		},
		watch: {
			width: {
				immediate: true,
				handler(n) {
					this.setStyle()
				}
			},
			height: {
				immediate: true,
				handler(n) {
					this.setStyle()
				}
			},
			radius: {
				immediate: true,
				handler(n) {
					this.setStyle()
				}
			},
			bgColor: {
				immediate: true,
				handler(n) {
					this.setStyle()
				}
			},
			fontSize: {
				immediate: true,
				handler(n) {
					this.setStyle()
				}
			},
			type: {
				immediate: true,
				handler(n) {
					this.setStyle()
				}
			},
			color: {
				immediate: true,
				handler(n) {
					this.setStyle()
				}
			},
			customStyle: {
				immediate: true,
				handler(n) {
					this.setStyle()
				}
			},
			shape: {
				immediate: true,
				handler(n) {
					this.setStyle()
				}
			},
		},
		mounted() {
			this.setStyle()
		},
		methods: {
			setStyle() {
				if (this.type) {
					switch (this.type) {
						case "mini":
							this.style = {
								width: '100rpx',
								height: '50rpx',
								fontSize: '24rpx',
								lineHeight: '50rpx',
								color: this.color,
								backgroundColor: this.bgColor,
								borderRadius: this.radius,
							}
							break;
						case "default":
							this.style = {
								width: '208rpx',
								height: '68rpx',
								fontSize: '28rpx',
								lineHeight: '68rpx',
								color: this.color,
								backgroundColor: this.bgColor,
								borderRadius: this.radius,
							}
							break;
						case "large":
							this.style = {
								width: '664rpx',
								height: '96rpx',
								fontSize: '32rpx',
								lineHeight: '96rpx',
								color: this.color,
								backgroundColor: this.bgColor,
								borderRadius: this.radius,
							}
							break;
					}
				} else {
					this.style = {
						width: this.width,
						height: this.height,
						fontSize: this.fontSize + 'rpx',
						lineHeight: this.height,
						color: this.color,
						backgroundColor: this.bgColor,
						borderRadius: this.radius,
					}
				}
				if (this.shape == 'circle') {
					this.style.border = `2rpx solid ${this.bgColor}`,
						this.style.backgroundColor = 'transparent'
					this.style.color = this.bgColor
				}
			},
			click() {
				this.$emit("click")
			},
			getphonenumber(e) {
				this.$emit("getphonenumber", e)
			},
			getuserinfo(e) {
				this.$emit("getuserinfo", e)
			},
			opensetting(e) {
				console.log('opensetting');
				this.$emit("opensetting", e)
			},
			launchapp(e) {
				this.$emit("launchapp", e)
			},
			contact(e) {
				this.$emit("contact", e)
			},
			chooseavatar(e) {
				this.$emit("chooseavatar", e)
			},
			addgroupapp(e) {
				this.$emit("addgroupapp", e)
			},
			chooseaddress(e) {
				this.$emit("chooseaddress", e)
			},
			chooseinvoicetitle(e) {
				this.$emit("chooseinvoicetitle", e)
			},
			subscribe(e) {
				this.$emit("subscribe", e)
			},
		}
	}
</script>

<style lang="scss" scoped>
	.n-button {
		width: 100%;
		text-align: center;
		position: relative;
		overflow: hidden;

		.open-type {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			margin: 0;
			opacity: 0;
			z-index: 9;
		}
	}
</style>
