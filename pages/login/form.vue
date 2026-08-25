<template>
  <view class="auth-page">
    <view class="back" @tap="back">‹</view>
    <view class="auth-icon">绿</view>
    <text class="title">欢迎回来</text>
    <text class="subtitle">登录后进入你的碳宝星球</text>
    <view class="form">
      <text class="label">用户名 / 学号</text>
      <input class="input" placeholder="请输入用户名或学号" v-model="username" />
      <text class="label">密码</text>
      <view class="password-box">
        <input class="input password-input" :password="!showPassword" placeholder="请输入密码" v-model="password" />
        <text class="toggle" @tap="showPassword = !showPassword">{{ showPassword ? '隐藏' : '显示' }}</text>
      </view>
      <view class="primary-btn submit" @tap="login">登录</view>
    </view>
    <text class="switch">还没有账号？<text @tap="register">立即注册</text></text>
  </view>
</template>

<script>
import { callCloud, roleHome, saveUserSession } from '../../common/cloud.js'
import { toast } from '../../common/mock.js'

export default {
  data() { return { username: '', password: '', showPassword: false } },
  methods: {
    back() { uni.navigateBack() },
    register() { uni.navigateTo({ url: '/pages/login/register' }) },
    async login() {
      const username = this.username.trim()
      if (!username || !this.password) return toast('请输入用户名和密码')
      try {
        const result = await callCloud('user-login', { username, password: this.password })
        saveUserSession(result.user)
        uni.reLaunch({ url: roleHome(result.user.role) })
      } catch (error) { toast(error.message || '登录失败') }
    }
  }
}
</script>

<style lang="scss">
@import '../../common/portal.scss';
.auth-page { min-height:100vh; padding:44rpx 40rpx; background:#f7faf9; box-sizing:border-box; }
.back { width:68rpx; height:68rpx; font-size:58rpx; }
.auth-icon { display:flex; align-items:center; justify-content:center; width:100rpx; height:100rpx; margin-top:90rpx; border-radius:24rpx; background:#56b36c; color:#00391a; font-size:44rpx; }
.auth-page .title { display:block; margin-top:36rpx; font-size:54rpx; }
.auth-page .subtitle { font-size:28rpx; color:#6d7a6e; }
.form { margin-top:90rpx; }
.label { display:block; margin:22rpx 8rpx 12rpx; color:#53615f; font-size:24rpx; }
.input { width:100%; height:112rpx; padding:0 28rpx; border:2rpx solid #d7dbda; border-radius:24rpx; background:#fff; box-sizing:border-box; font-size:27rpx; }
.password-box { position:relative; }
.password-input { padding-right:110rpx; }
.toggle { position:absolute; top:0; right:28rpx; display:flex; align-items:center; height:112rpx; color:#277346; font-size:23rpx; }
.submit { height:112rpx; margin-top:46rpx; border-radius:24rpx; font-size:34rpx; font-weight:700; }
.switch { display:block; margin-top:38rpx; text-align:center; color:#53615f; font-size:25rpx; }
.switch text { color:#006d37; }
</style>
