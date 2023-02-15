import {
	className
} from '@/utils/index.js'
import {
	mapState
} from 'vuex'
const mixins = {
	data() {
		return {

		}
	},
	computed: {
		...mapState({
			zIndex: state => state.home.zIndex,
			className: state => state.home.className,
			menuShow: state => state.home.menuShow,
			page: state => state.home.page
		})
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
