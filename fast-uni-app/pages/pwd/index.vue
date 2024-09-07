<template>
	<view class="forget-pwd">
		<view class="item-info">
			<text class="item-size item-text">手机号码</text>
			<input class="item-input item-size  item-phone" placeholder="请输入手机号码" />
			<button type="primary" class="item-code">获取验证码</button>
		</view>
		<view class="item-info">
			<text class="item-size item-text">验证码</text>
			<input class="item-input item-size" placeholder="请输入验证码" />
		</view>
		<view class="item-info">
			<text class="item-size item-text">密码</text>
			<input class="item-input item-size" placeholder="请输入6-16位的密码" />
		</view>
		<view class="item-info">
			<text class="item-size item-text">确认密码</text>
			<input class="item-input item-size" placeholder="请再次输入密码" />
		</view>
		<button type="primary" class="register-btn">确定</button>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {

		}
	}
</script>

<style lang="scss">
	.forget-pwd {
		padding: 0 8vw;
		text-align: center;

		.item-info {
			display: flex;
			border-bottom: 1px solid #000;
			margin-bottom: 2vh;

			.item-text {
				width: 20vw;
				text-align: left;
			}

			.item-size {
				font-size: large;
				height: 7vh;
				line-height: 7vh;
			}

			.item-input {
				width: 64vw;
				text-align: left;
			}

			.item-phone {
				width: 44vw;
			}

			.item-code {
				font-size: 0.6rem;
				width: 20vw;
				/* font-size: small; */
				height: 3vh;
				line-height: 3vh;
				margin: auto;
			}
		}

		.register-btn {
			margin-top: 5vh;
		}
	}
</style>