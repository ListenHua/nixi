import {
	className
} from '@/utils/index.js'
const mixins = {
	props: {
		menuShow: {
			type: Boolean,
			default: false,
		},
		page: {
			type: Object,
			default: () => {
				main: '';
				minor: ''
			}
		}
	},
	data() {
		return {
			zIndex: 30,
			className: '',
		}
	},
	mounted() {
		this.checkPage()
	},
	methods: {
		checkPage() {
			let params = className(this.menuShow, this.page, this.$options.name)
			this.className = params.class
			this.zIndex = params.zIndex
		},
		switchInPage() {
			this.$emit("switch", this.$options.name)
		}
	}
}
export default mixins
