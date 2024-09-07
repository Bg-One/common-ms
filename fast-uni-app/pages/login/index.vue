<template>
	<view class="login-container">
		<view class="login-bg">
			<image src="../../static/image/login.png"></image>
		</view>
		<view class="login-view">
			<view class="welcome-title">欢迎登陆</view>
			<view class="input-item">
				<image src="../../static/icon/phone.png" class="cus-icon"></image>
				<input v-model="loginFormData.userName" class="input" type="text" placeholder="请输入用户名或手机号码"
					maxlength="30" />
			</view>
			<view class="input-item">
				<image src="../../static/icon/lock.png" class="cus-icon"></image>
				<input v-model="loginFormData.password" class="input" type="password" placeholder="请输入密码"
					maxlength="30" />
			</view>
			<!-- 	<view class="remember">
				<checkbox :checked="loginFormData.remember"></checkbox>记住密码
			</view> -->
			<view class="action-btn">
				<button type="primary" @click="handleLogin" class="">登录</button>
			</view>
			<view class="action">
				<text class="text-action" @click="handlRegister">注册</text>
				<text class="text-action" @click="handlPwd">忘记密码</text>
			</view>
		</view>
	</view>
</template>

<script>
	import storage from '../../utils/storage';
	import {
		sm3
	} from "sm-crypto";
	export default {
		data() {
			return {
				loginFormData: {
					userName: '',
					password: '',
					// remember: false,
				},
				captchaEnabled: false,
			};
		},

		methods: {
			iniUserInfo() {

			},
			// 登录方法
			async handleLogin() {
				if (this.loginFormData.username === "") {
					this.$modal.msgError("请输入用户名")
				} else if (this.loginFormData.password === "") {
					this.$modal.msgError("请输入密码")
				} else {
					this.$modal.loading("登录中，请耐心等待...")
					this.pwdLogin()
				}
			},
			// 密码登录
			async pwdLogin() {
				this.$store.dispatch('Login', {
					...this.loginFormData,
					password: sm3(this.loginFormData.password)
				}).then(() => {
					this.$modal.closeLoading()
					this.loginSuccess()
				}).catch(() => {
					if (this.captchaEnabled) {
						this.getCode()
					}
				})
			},
			// 登录成功后，处理函数
			loginSuccess(result) {
				// 设置用户信息
				this.$store.dispatch('GetInfo').then(res => {
					this.$tab.reLaunch('/pages/index/index')
				})
			},
			handlRegister() {
				this.$tab.navigateTo(`/pages/register/index`)
			},
			handlPwd(){
				this.$tab.navigateTo(`/pages/pwd/index`)
			}
		}
	}
</script>

<style lang="scss">
	.login-container {
		width: 100%;

		.login-bg {
			padding: 10vh 0;
			text-align: center;
		}

		.login-view {
			width: 90vw;
			margin: 0 auto;

			.welcome-title {
				margin-bottom: 3vh;
				font-size: larger;
				font-weight: bolder
			}

			.input-item {
				margin-bottom: 2vh;
				border-bottom: 1px solid;
				display: flex;
				margin-left: 0;

				.icon {
					font-size: 38rpx;
					margin-left: 10px;
					color: #999;
				}

				.input {
					width: 100%;
					font-size: 14px;
					line-height: 20px;
					text-align: left;
					padding-left: 15px;
				}
			}

			.remember {
				margin-bottom: 2vh;
			}

			.action {
				display: flex;
				justify-content: space-between;
				margin-top: 1vh;

				.text-action {
					color: #007aff;
					border-bottom: 1px solid #007aff;
				}
			}
		}


	}
</style>