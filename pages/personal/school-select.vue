<template>
  <view class="page school-page">
    <view class="head">
      <text class="eyebrow">&#x4E2A;&#x4EBA;&#x7AEF;&#x8BBE;&#x7F6E;</text>
      <text class="title">&#x9009;&#x62E9;&#x4F60;&#x7684;&#x5B66;&#x6821;</text>
      <text class="subtitle">&#x7ED1;&#x5B9A;&#x5B66;&#x6821;&#x540E;&#xFF0C;&#x4F60;&#x5C06;&#x53EA;&#x770B;&#x5230;&#x672C;&#x6821;&#x7684;&#x4F4E;&#x78B3;&#x6D3B;&#x52A8;&#x3002;</text>
    </view>
    <view class="search"><input class="input" placeholder="&#x641C;&#x7D22;&#x5B66;&#x6821;&#x540D;&#x79F0;" v-model="keyword" /></view>
    <view v-for="school in filteredSchools" :key="school._id" :class="['school card', selected === school._id ? 'selected' : '']" @tap="selected = school._id">
      <view><text class="school-name">{{ school.name }}</text><text class="muted">{{ school.province || '&#x6821;&#x56ED;&#x4F4E;&#x78B3;&#x6D3B;&#x52A8;' }}</text></view>
      <text v-if="selected === school._id" class="check">&#x2713;</text>
    </view>
    <view class="primary-btn submit" @tap="save">&#x786E;&#x8BA4;&#x5E76;&#x8FDB;&#x5165;&#x9996;&#x9875;</view>
  </view>
</template>
<script>
import { callCloud, saveUserSession } from '../../common/cloud.js'
import { toast } from '../../common/mock.js'
export default {
  data() { return { schools: [], selected: '', keyword: '' } },
  computed: { filteredSchools() { return this.schools.filter(item => !this.keyword || item.name.includes(this.keyword)) } },
  async onLoad() {
    try { const result = await callCloud('school-list'); this.schools = result.data || [] }
    catch (error) { this.schools = [{ _id: 'school_001', name: '&#x5B89;&#x5FBD;&#x7406;&#x5DE5;&#x5927;&#x5B66;', province: '&#x5B89;&#x5FBD;' }] }
  },
  methods: {
    async save() {
      if (!this.selected) return toast('&#x8BF7;&#x9009;&#x62E9;&#x5B66;&#x6821;')
      try {
        const user = uni.getStorageSync('user_session') || {}
        const school = this.schools.find(item => item._id === this.selected)
        const result = await callCloud('user-school-update', { userId: user.id, schoolId: this.selected })
        saveUserSession({ ...user, schoolId: result.schoolId })
        uni.setStorageSync('user_school_name', school?.name || '')
        uni.reLaunch({ url: '/pages/index/index' })
      } catch (error) { toast(error.message || '&#x5B66;&#x6821;&#x7ED1;&#x5B9A;&#x5931;&#x8D25;') }
    }
  }
}
</script>
<style lang="scss">@import '../../common/portal.scss';.school-page{padding-bottom:60rpx}.search{margin:24rpx 0}.input{width:100%;height:88rpx;padding:0 24rpx;border-radius:20rpx;background:#fff;box-sizing:border-box}.school{display:flex;align-items:center;justify-content:space-between;margin-bottom:16rpx}.school.selected{border:3rpx solid #27ae60;background:#e5f4e9}.school-name{display:block;font-size:29rpx;font-weight:700}.check{color:#006d37;font-size:40rpx}.submit{margin-top:36rpx}</style>
