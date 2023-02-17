import {
	className
} from '@/utils/index.js'
import {
	mapState,
	mapMutations
} from 'vuex'
const mixins = {
	data() {
		return {
			zIndex: 30,
			className: '',
		}
	},
	computed: {
		...mapState({
			menuShow: state => state.home.menuShow,
			page: state => state.home.page
		})
	},
	watch: {
		menuShow(newVal) {
			this.handleStyle()
		},
	},
	mounted() {
		this.handleStyle()
	},
	methods: {
		...mapMutations(['checkPage']),
		switchInPage() {
			this.$emit("switch", this.$options.name)
		},
		handleStyle() {
			let page = this.page
			let name = this.$options.name
			if (this.menuShow) {
				if (page.main == name) {
					this.className = 'scale-page'
					this.zIndex = 50
				} else if (page.minor == name) {
					this.className = 'scale-page-minor'
					this.zIndex = 40
				} else {
					this.className = 'hide-page'
				}
			} else {
				if (page.main == name) {
					this.className = ''
					this.zIndex = 50
				} else if (page.minor == name) {
					this.className = ''
					this.zIndex = 40
				} else {
					this.className = 'hide-page'
				}
			}
		},
	}
}
export default mixins
