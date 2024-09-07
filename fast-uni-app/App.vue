<script>
	import {
		getToken
	} from '@/utils/auth'
	export default {
		onLaunch: function() {
			this.initApp()
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {
			// 初始化应用
			initApp() {
				// 检查用户登录状态
				this.checkLogin()
			},
			checkLogin() {
				if (!getToken()) {
					this.$tab.reLaunch('/pages/login/index')
				}
			}
		}
	}
</script>

<style>
	@import '@/static/css/global.css'
</style>