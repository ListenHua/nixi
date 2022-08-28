<template>
	<view>

	</view>
</template>

<script>
	import {
		request
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				topic: [],
				pageType: '',
			}
		},
		onLoad(option) {
			console.log(option);
			if (option.type == 'preview') {
				this.pageType = option.type
				this.topic = JSON.parse(option.topic)
				this.getTopic()
			} else {

			}
		},
		methods: {
			getTopic() {
				let params = {
					page: 1,
					limit: this.topic.length,
					topic: this.topic
				}
				request('get/getTopicList', params).then(res => {
					console.log(res);

				})
			}
		}
	}
</script>

<style>

</style>
